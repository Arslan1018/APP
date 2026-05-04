import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, SafeAreaView, StatusBar
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ARScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const arUrl = `${process.env.EXPO_PUBLIC_API_URL?.replace(':4000', ':3000') || 'http://localhost:3000'}/ar/${code}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>AR Preview</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* WebView wrapping the Next.js AR page */}
      <WebView
        source={{ uri: arUrl }}
        style={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
      />

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#f97316" />
          <Text style={styles.loaderText}>Loading AR Experience...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backBtn: { padding: 4 },
  backText: { color: '#f97316', fontSize: 16, fontWeight: '600' },
  title: { color: 'white', fontSize: 16, fontWeight: '700' },
  webview: { flex: 1 },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  loaderText: { color: 'rgba(255,255,255,0.5)', marginTop: 12, fontSize: 14 },
});
