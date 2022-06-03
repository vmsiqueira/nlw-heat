import React from 'react';
import { ScrollView } from 'react-native';

import { Message } from "../Message";

import { styles } from './styles';

export function MessageList() {
  const message = {
    id: '1',
    text: 'mesagem de test',
    user: {
      name: 'Vitor Siqueira',
      avatar_url: 'https://github.com/vmsiqueira.png'
    }
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps='never'
    >
      <Message data={message} />
      <Message data={message} />
      <Message data={message} />
    </ScrollView>
  );
}