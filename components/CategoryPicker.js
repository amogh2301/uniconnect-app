import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { EVENT_CATEGORIES } from '../utils/categories';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

export default function CategoryPicker({ selectedCategory, onSelectCategory, style }) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedCategoryData = EVENT_CATEGORIES.find(cat => cat.id === selectedCategory) || EVENT_CATEGORIES[EVENT_CATEGORIES.length - 1];

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategoryItem,
        { borderLeftColor: item.color }
      ]}
      onPress={() => {
        onSelectCategory(item.id);
        setModalVisible(false);
      }}
    >
      <View style={styles.categoryContent}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
        <View style={styles.categoryTextContainer}>
          <Text style={[
            styles.categoryName,
            selectedCategory === item.id && styles.selectedCategoryName
          ]}>
            {item.name}
          </Text>
          <Text style={[
            styles.categoryDescription,
            selectedCategory === item.id && styles.selectedCategoryDescription
          ]}>
            {item.description}
          </Text>
        </View>
      </View>
      {selectedCategory === item.id && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          { borderColor: selectedCategoryData.color }
        ]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.pickerContent}>
          <Text style={styles.pickerIcon}>{selectedCategoryData.icon}</Text>
          <Text style={styles.pickerText}>{selectedCategoryData.name}</Text>
        </View>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Event Category</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={EVENT_CATEGORIES}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  pickerButton: {
    borderWidth: 2,
    borderRadius: 12,
    padding: isSmallScreen ? 14 : 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pickerIcon: {
    fontSize: isSmallScreen ? 18 : 20,
    marginRight: 12,
  },
  pickerText: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '500',
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isSmallScreen ? 16 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  categoryList: {
    paddingBottom: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isSmallScreen ? 16 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderLeftWidth: 4,
    backgroundColor: '#fff',
  },
  selectedCategoryItem: {
    backgroundColor: '#f8f9fa',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: isSmallScreen ? 24 : 28,
    marginRight: 16,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedCategoryName: {
    color: '#000',
  },
  categoryDescription: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#666',
    lineHeight: 18,
  },
  selectedCategoryDescription: {
    color: '#333',
  },
  checkmark: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
}); 