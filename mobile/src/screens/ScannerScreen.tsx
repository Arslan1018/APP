import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, Animated, Dimensions, StatusBar
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const SCAN_BOX = width * 0.7;

export default function ScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate scan line
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(scanLineAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const scanLineY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_BOX - 4],
  });

  const handleScan = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Parse AR code from URL or raw code
    let code = data;
    try {
      const url = new URL(data);
      const parts = url.pathname.split('/');
      code = parts[parts.length - 1];
    } catch {
      // data is already just the code
    }

    // Navigate to AR viewer
    router.push(`/ar/${code}`);
    setTimeout(() => setScanned(false), 3000);
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.permTitle}>Camera Access Needed</Text>
        <Text style={styles.permText}>
          ARMenu needs camera access to scan QR codes on menus and show you food in AR.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Allow Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={torch}
        onBarcodeScanned={scanned ? undefined : handleScan}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {/* Dark overlay with hole */}
      <View style={styles.overlay}>
        <View style={styles.topOverlay} />
        <View style={styles.midRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanBox}>
            {/* Corner markers */}
            {[
              { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
              { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
              { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
              { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
            ].map((corner, i) => (
              <View key={i} style={[styles.corner, corner]} />
            ))}
            {/* Scan line */}
            <Animated.View
              style={[styles.scanLine, { transform: [{ translateY: scanLineY }] }]}
            />
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay} />
      </View>

      {/* UI */}
      <View style={styles.topBar}>
        <Text style={styles.appTitle}>🍽️ ARMenu</Text>
      </View>

      <View style={styles.hint}>
        <Text style={styles.hintTitle}>
          {scanned ? '✅ Code Scanned! Opening AR...' : 'Point at a Menu QR Code'}
        </Text>
        <Text style={styles.hintSub}>
          {scanned ? '' : 'Hold your phone steady over the QR code on your menu'}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlBtn, torch && styles.controlBtnActive]}
          onPress={() => setTorch(!torch)}
        >
          <Text style={styles.controlIcon}>🔦</Text>
          <Text style={styles.controlLabel}>Torch</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => router.push('/')}
        >
          <Text style={styles.controlIcon}>🏠</Text>
          <Text style={styles.controlLabel}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const OVERLAY_COLOR = 'rgba(0,0,0,0.72)';
const CORNER_SIZE = 24;
const CORNER_COLOR = '#f97316';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: { ...StyleSheet.absoluteFillObject, flexDirection: 'column' },
  topOverlay: { flex: 1, backgroundColor: OVERLAY_COLOR },
  midRow: { flexDirection: 'row', height: SCAN_BOX },
  sideOverlay: { flex: 1, backgroundColor: OVERLAY_COLOR },
  scanBox: {
    width: SCAN_BOX,
    height: SCAN_BOX,
    position: 'relative',
    overflow: 'hidden',
  },
  bottomOverlay: { flex: 1, backgroundColor: OVERLAY_COLOR },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: CORNER_COLOR,
    borderRadius: 2,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: CORNER_COLOR,
    opacity: 0.8,
    shadowColor: CORNER_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  appTitle: { color: 'white', fontSize: 20, fontWeight: '700' },
  hint: {
    position: 'absolute',
    bottom: 160,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  hintTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },
  hintSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: 24,
  },
  controlBtn: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  controlBtnActive: { backgroundColor: 'rgba(249,115,22,0.3)' },
  controlIcon: { fontSize: 24, marginBottom: 4 },
  controlLabel: { color: 'white', fontSize: 12, fontWeight: '500' },
  permTitle: { color: 'white', fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  permText: { color: 'rgba(255,255,255,0.5)', fontSize: 15, textAlign: 'center', marginHorizontal: 32, marginBottom: 32 },
  permBtn: { backgroundColor: '#f97316', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 16 },
  permBtnText: { color: 'white', fontWeight: '700', fontSize: 16 },
});
