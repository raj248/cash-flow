import { requireNativeView } from 'expo';
import * as React from 'react';

import { ListenerViewProps } from './Listener.types';

const NativeView: React.ComponentType<ListenerViewProps> =
  requireNativeView('Listener');

export default function ListenerView(props: ListenerViewProps) {
  return <NativeView {...props} />;
}
