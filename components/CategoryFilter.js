import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { EVENT_CATEGORIES } from '../utils/categories';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter by Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <TouchableOpacity
          style={[
            styles.categoryItem,
            !selectedCategory && styles.selectedCategoryItem,
            { borderColor: !selectedCategory ? '#3366FF' : '#e0e0e0' }
          ]}
          onPress={() => onSelectCategory(null)}
        >
          <Text style={styles.categoryIcon}>📋</Text>
          <Text style={[
            styles.categoryName,
            !selectedCategory && styles.selectedCategoryName
          ]}>
            All Events
          </Text>
        </TouchableOpacity>

        {EVENT_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              selectedCategory === category.id && styles.selectedCategoryItem,
              { borderColor: selectedCategory === category.id ? category.color : '#e0e0e0' }
            ]}
            onPress={() => onSelectCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryName,
              selectedCategory === category.id && styles.selectedCategoryName
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: isSmallScreen ? 12 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: isSmallScreen ? 8 : 12,
    paddingHorizontal: isSmallScreen ? 16 : 20,
  },
  scrollContainer: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingVertical: isSmallScreen ? 8 : 12,
    marginRight: isSmallScreen ? 12 : 16,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: '#fff',
    minWidth: isSmallScreen ? 80 : 90,
  },
  selectedCategoryItem: {
    backgroundColor: '#f8f9fa',
  },
  categoryIcon: {
    fontSize: isSmallScreen ? 16 : 18,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: isSmallScreen ? 10 : 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  selectedCategoryName: {
    color: '#333',
    fontWeight: '600',
  },
}); 