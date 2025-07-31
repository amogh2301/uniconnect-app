import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  TextInput,
  FlatList,
  Keyboard,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

export default function LocationPicker({ visible, onClose, onLocationSelect, initialLocation }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // UBC Campus as default region
  const initialRegion = {
    latitude: initialLocation?.latitude || 49.2606,
    longitude: initialLocation?.longitude || -123.2460,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  useEffect(() => {
    if (visible) {
      getCurrentLocation();
      if (initialLocation) {
        setSelectedLocation(initialLocation);
        reverseGeocode(initialLocation.latitude, initialLocation.longitude);
      }
    }
    
    // Cleanup function
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [visible, initialLocation]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to use this feature.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.log('Error getting current location:', error);
    }
  };

  const searchLocations = async (query) => {
    if (query.length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setIsSearching(true);
      console.log('Searching for:', query);
      
      // Try different search strategies
      const searchQueries = [
        query + ', Vancouver, BC',
        query + ', UBC, Vancouver, BC',
        query + ', BC, Canada'
      ];

      let foundResults = [];

      for (const searchQuery of searchQueries) {
        try {
          const encodedQuery = encodeURIComponent(searchQuery);
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=5&addressdetails=1`;
          
          console.log('Searching URL:', url);
          
          const response = await fetch(url);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Search results for', searchQuery, ':', data.length, 'results');
            
            if (data && data.length > 0) {
              foundResults = data;
              break; // Use first successful search
            }
          } else {
            console.log('Search failed for', searchQuery, 'Status:', response.status);
          }
        } catch (error) {
          console.log('Search error for', searchQuery, ':', error);
        }
      }

      console.log('Setting search results:', foundResults.length, 'results');
      console.log('First result:', foundResults[0]);
      
      setSearchResults(foundResults);
      setShowSearchResults(foundResults.length > 0);
      
      console.log('Search results state set. showSearchResults:', foundResults.length > 0);
      console.log('Final search results:', foundResults.length);
      
    } catch (error) {
      console.log('Search error:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      searchLocations(text);
    }, 500); // Wait 500ms after user stops typing
    
    setSearchTimeout(timeout);
  };

  const handleSearchResultSelect = (result) => {
    console.log('Search result selected:', result);
    const location = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    };
    
    setSelectedLocation(location);
    setAddress(result.display_name);
    setSearchQuery(result.display_name);
    setShowSearchResults(false);
    Keyboard.dismiss();
    
    console.log('Location set to:', location);
    console.log('Address set to:', result.display_name);
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.display_name) {
          setAddress(data.display_name);
          setSearchQuery(data.display_name);
        }
      }
    } catch (error) {
      console.log('Reverse geocoding error:', error);
      setAddress('Location selected');
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    reverseGeocode(latitude, longitude);
    setShowSearchResults(false);
    Keyboard.dismiss();
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        address: address,
      });
      onClose();
    } else {
      Alert.alert('No location selected', 'Please tap on the map or search for a location.');
    }
  };

  const handleClose = () => {
    setSelectedLocation(null);
    setAddress('');
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    onClose();
  };

  const renderSearchResult = ({ item }) => {
    console.log('Rendering search result:', item);
    return (
      <TouchableOpacity
        style={styles.searchResult}
        onPress={() => handleSearchResultSelect(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.searchResultText} numberOfLines={2}>
          {item.display_name}
        </Text>
        <Text style={styles.searchResultType}>
          {item.type || 'location'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Location</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a location (e.g., Rose Garden, UBC)"
            value={searchQuery}
            onChangeText={handleSearchChange}
            onFocus={() => setShowSearchResults(true)}
          />
          {isSearching && (
            <ActivityIndicator size="small" color="#3366FF" style={styles.searchLoading} />
          )}
        </View>

        {/* Debug info */}
        {__DEV__ && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>
              Search: "{searchQuery}" | Results: {searchResults.length} | Show: {showSearchResults.toString()}
            </Text>
          </View>
        )}

        {/* Search Results - Simple List */}
        {showSearchResults && searchResults.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchResultsHeader}>
              Found {searchResults.length} location(s):
            </Text>
            {searchResults.map((result, index) => (
              <TouchableOpacity
                key={index}
                style={styles.searchResult}
                onPress={() => handleSearchResultSelect(result)}
                activeOpacity={0.7}
              >
                <Text style={styles.searchResultText} numberOfLines={2}>
                  {result.display_name}
                </Text>
                <Text style={styles.searchResultType}>
                  {result.type || 'location'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {showSearchResults && searchResults.length === 0 && searchQuery.length >= 3 && !isSearching && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              No locations found for "{searchQuery}"
            </Text>
            <Text style={styles.noResultsSubtext}>
              Try a different search term or tap on the map
            </Text>
          </View>
        )}

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            onPress={handleMapPress}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                pinColor="#3366FF"
              />
            )}
            {userLocation && (
              <Marker
                coordinate={userLocation}
                pinColor="green"
                title="Your Location"
              />
            )}
          </MapView>
        </View>

        <View style={styles.bottomContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3366FF" />
              <Text style={styles.loadingText}>Getting address...</Text>
            </View>
          ) : selectedLocation ? (
            <View style={styles.locationInfo}>
              <Text style={styles.addressText} numberOfLines={2}>
                {address || 'Location selected'}
              </Text>
              <Text style={styles.coordinatesText}>
                {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
              </Text>
            </View>
          ) : (
            <Text style={styles.instructionText}>
              Search for a location or tap on the map to select
            </Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleConfirm} 
              style={[styles.confirmButton, !selectedLocation && styles.disabledButton]}
              disabled={!selectedLocation}
            >
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isSmallScreen ? 12 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    color: '#666',
  },
  searchContainer: {
    padding: isSmallScreen ? 12 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  searchLoading: {
    marginLeft: 8,
  },
  searchResultsContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3366FF',
    borderRadius: 8,
    margin: 16,
    maxHeight: 200,
    overflow: 'hidden',
  },
  searchResultsHeader: {
    padding: 12,
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9ff',
  },
  searchResultsList: {
    flex: 1,
    maxHeight: 150,
  },
  searchResultsContent: {
    maxHeight: 200,
  },
  searchResult: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  searchResultText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  searchResultType: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  noResultsContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    zIndex: 1000,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  bottomContainer: {
    padding: isSmallScreen ? 12 : 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  locationInfo: {
    marginBottom: 16,
  },
  addressText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: isSmallScreen ? 12 : 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: isSmallScreen ? 12 : 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#3366FF',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  debugContainer: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  debugText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
}); 