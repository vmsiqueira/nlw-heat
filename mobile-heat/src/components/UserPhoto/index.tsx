import React from 'react';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import avatarImg from '../../assets/avatar.png';

import { styles } from './styles';
import { COLORS } from '../../theme';

const imgSizes = {
  small: {
    containerSize: 32,
    avatarSize: 28,
  },
  normal: {
    containerSize: 48,
    avatarSize: 42,
  },
}

type UserPhotoProps = {
  imageUri: string | undefined;
  sizes?: 'small' | 'normal'
}

const avatarDefault = Image.resolveAssetSource(avatarImg).uri;

export function UserPhoto({ imageUri, sizes = 'normal' }: UserPhotoProps) {
  const { containerSize, avatarSize } = imgSizes[sizes];
  return (
    <LinearGradient 
      colors={[COLORS.PINK, COLORS.YELLOW]} 
      start={{ x: 0, y: 0.8}}
      end={{ x: 0.9, y: 1 }}
      style={[styles.container, {
        width: containerSize,
        height: containerSize,
        borderRadius: avatarSize / 2
      }]}
    >
      <Image 
        source={{ uri: imageUri || avatarDefault }}
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2
          }
        ]} 
      />
    </LinearGradient>
  );
}