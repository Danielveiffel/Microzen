import React from 'react';
import { View, Text } from 'react-native';

const NAVY = '#1A237E';
const BLUE = '#1565C0';
const LIGHT_BLUE = '#64B5F6';
const BORDER_BLUE = '#5B9EC9';
const GRAY = '#757575';

const Wave = ({ color, curveDir, width, height }) => (
  <View
    style={{
      width,
      height,
      backgroundColor: color,
      borderTopLeftRadius: curveDir === 'a' ? height * 0.9 : height * 0.15,
      borderTopRightRadius: curveDir === 'a' ? height * 0.15 : height * 0.9,
      borderBottomLeftRadius: curveDir === 'a' ? height * 0.15 : height * 0.9,
      borderBottomRightRadius: curveDir === 'a' ? height * 0.9 : height * 0.15,
    }}
  />
);

const WaveIcon = ({ size }) => {
  const waveW = size * 0.56;
  const waveH = size * 0.135;
  const gap = size * 0.055;
  const border = Math.max(2, size * 0.048);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: border,
        borderColor: BORDER_BLUE,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        gap,
      }}
    >
      <Wave color={NAVY}       curveDir="a" width={waveW} height={waveH} />
      <Wave color={BLUE}       curveDir="b" width={waveW} height={waveH} />
      <Wave color={LIGHT_BLUE} curveDir="a" width={waveW} height={waveH} />
    </View>
  );
};

/**
 * size: 'small' | 'normal' | 'large'
 * light: true para texto blanco (sobre fondos oscuros)
 * iconOnly: true para mostrar solo el ícono circular
 */
export const DensimabLogo = ({ size = 'normal', light = false, iconOnly = false }) => {
  const cfg = {
    small:  { icon: 34, name: 19, sub: 10 },
    normal: { icon: 48, name: 26, sub: 12 },
    large:  { icon: 64, name: 34, sub: 14 },
  }[size] || { icon: 48, name: 26, sub: 12 };

  if (iconOnly) return <WaveIcon size={cfg.icon} />;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <WaveIcon size={cfg.icon} />
      <View style={{ marginLeft: 10 }}>
        <Text
          style={{
            fontSize: cfg.name,
            fontWeight: '900',
            color: light ? '#fff' : NAVY,
            letterSpacing: -0.5,
          }}
        >
          Densimab
        </Text>
        {size !== 'small' && (
          <>
            <Text style={{ fontSize: cfg.sub, color: light ? '#BBDEFB' : GRAY, marginTop: 2 }}>
              Denosumab 60 mg/mL
            </Text>
            <Text style={{ fontSize: cfg.sub, color: light ? '#BBDEFB' : GRAY }}>
              Jeringa prellenada
            </Text>
          </>
        )}
      </View>
    </View>
  );
};
