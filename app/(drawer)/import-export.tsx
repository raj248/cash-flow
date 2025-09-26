import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { exportData, importData } from '~/utils/exportImport';
import Toast from 'react-native-toast-message';

async function saveToDownloads(json: string) {
  // SAF → request access to a user folder
  const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (!permissions.granted) {
    Toast.show({
      type: 'error',
      text1: 'Permission not granted!',
    });
    return;
  }

  await FileSystem.StorageAccessFramework.createFileAsync(
    permissions.directoryUri,
    'backup',
    'application/json'
  )
    .then(async (uri) => {
      await FileSystem.writeAsStringAsync(uri, json, { encoding: FileSystem.EncodingType.UTF8 });
      Toast.show({
        type: 'success',
        text1: 'Backup saved successfully!',
      });
    })
    .catch((err) => console.error('Error saving file', err));
}

async function handleExport() {
  const data = exportData();
  const json = JSON.stringify(data, null, 2);
  const path = FileSystem.documentDirectory + 'backup.json';

  await FileSystem.writeAsStringAsync(path, json, { encoding: 'utf8' });
  await Sharing.shareAsync(path);
}

async function handleExportToDownloads() {
  const data = exportData();
  const json = JSON.stringify(data, null, 2);
  const path = FileSystem.documentDirectory + 'backup.json';

  await FileSystem.writeAsStringAsync(path, json, { encoding: 'utf8' });
  // await Sharing.shareAsync(path);
  await saveToDownloads(json);
}

async function handleImport() {
  const res = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
  if (res.canceled) return;

  const json = await FileSystem.readAsStringAsync(res.assets[0].uri);
  const data = JSON.parse(json);
  importData(data);
  Toast.show({
    type: 'success',
    text1: 'Backup imported successfully!',
  });
}

export default function BackupScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Backup & Restore' }} />
      <View style={{ flex: 1, justifyContent: 'center', padding: 16, gap: 20 }}>
        <Card>
          <Card.Title title="Export Data" />
          <Card.Content>
            <Text>Save all your entries and categories as a backup file.</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={handleExport}>
              Export
            </Button>
          </Card.Actions>
        </Card>

        <Card>
          <Card.Title title="Export to SD Card" />
          <Card.Content>
            <Text>Save all your entries and categories directly to storage.</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={handleExportToDownloads}>
              Export (SD Card)
            </Button>
          </Card.Actions>
        </Card>

        <Card>
          <Card.Title title="Import Data" />
          <Card.Content>
            <Text>Restore your data from a backup JSON file.</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={handleImport}>
              Import
            </Button>
          </Card.Actions>
        </Card>

        <Card>
          <Card.Title title="Backup to Google Drive" />
          <Card.Content>
            <Text>Coming soon: save your backup to Google Drive.</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" disabled>
              Backup (Google Drive)
            </Button>
          </Card.Actions>
        </Card>

        <Card>
          <Card.Title title="Backup to GitHub" />
          <Card.Content>
            <Text>Coming soon: push your backup to a GitHub repository.</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" disabled>
              Backup (GitHub)
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </>
  );
}
