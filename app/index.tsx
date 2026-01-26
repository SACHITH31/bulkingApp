import React, { useState } from 'react';
import { 
  StyleSheet, View, SafeAreaView, StatusBar, 
  TouchableOpacity, Text, Platform 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// IMPORT YOUR SCREEN COMPONENTS
import HomeScreen from '../components/myscreens/HomeScreen';
import FoodScreen from '../components/myscreens/FoodScreen';
import WorkScreen from '../components/myscreens/WorkScreen';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState('Home');

  // Helper to render the correct screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen />;
      case 'Food':
        return <FoodScreen />;
      case 'Work':
        return <WorkScreen />;
      default:
        return (
          <View style={styles.center}>
            <Text style={{color: '#666'}}>{currentScreen} Screen Coming Soon</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* GLOBAL APP HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Bulking_App</Text>
          <Text style={styles.headerSubtitle}>Target: 63kg • July 2nd</Text>
        </View>
        <View style={styles.profileCircle}>
          <Text style={styles.profileText}>54</Text>
        </View>
      </View>

      {/* ACTIVE SCREEN CONTENT */}
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>

      {/* BOTTOM NAVIGATION BAR */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('Home')}>
          <Feather name="home" size={22} color={currentScreen === 'Home' ? '#007AFF' : '#666'} />
          <Text style={[styles.navLabel, currentScreen === 'Home' && {color: '#007AFF'}]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('Food')}>
          <Feather name="book-open" size={22} color={currentScreen === 'Food' ? '#007AFF' : '#666'} />
          <Text style={[styles.navLabel, currentScreen === 'Food' && {color: '#007AFF'}]}>Food</Text>
        </TouchableOpacity>

        {/* Action Button (Center) */}
        <View style={styles.addBtn}>
          <Feather name="plus" size={28} color="white" />
        </View>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('Drafts')}>
          <Feather name="layers" size={22} color={currentScreen === 'Drafts' ? '#007AFF' : '#666'} />
          <Text style={[styles.navLabel, currentScreen === 'Drafts' && {color: '#007AFF'}]}>Drafts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('Work')}>
          <Feather name="award" size={22} color={currentScreen === 'Work' ? '#007AFF' : '#666'} />
          <Text style={[styles.navLabel, currentScreen === 'Work' && {color: '#007AFF'}]}>Work</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? 45 : 10, 
    paddingBottom: 20 
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  headerSubtitle: { 
    color: '#666', 
    fontSize: 12 
  },
  profileCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#1C1C1E', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  profileText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  navBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    backgroundColor: '#111', 
    paddingVertical: 15, 
    borderTopWidth: 0.5, 
    borderTopColor: '#333' 
  },
  navItem: { 
    alignItems: 'center' 
  },
  navLabel: { 
    fontSize: 10, 
    color: '#666', 
    marginTop: 4 
  },
  addBtn: { 
    width: 54, 
    height: 54, 
    borderRadius: 27, 
    backgroundColor: '#007AFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: -40,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});