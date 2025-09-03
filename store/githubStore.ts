import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useRateStore } from '~/store/rateStore';
import Toast from 'react-native-toast-message';

interface GitHubStore {
  token: string | null;
  gistId: string | null;
  setToken: (token: string) => void;
  setGistId: (id: string) => void;
  clearGitHubData: () => void;
  backupToGitHub: () => Promise<void>;
  loadFromGitHub: () => Promise<void>;
}
const GIST_FILENAME = 'rate-data.json';

const fetchGistId = async (token: string) => {
  try {
    const response = await fetch('https://api.github.com/gists', {
      headers: { Authorization: `token ${token}` },
    });

    const gists = await response.json();
    const existingGist = gists.find((gist: any) => gist.description === 'Rate Calculation Backup');

    if (existingGist) {
      useGitHubStore.getState().setGistId(existingGist.id);
    }
  } catch (error) {
    console.error('Failed to fetch existing Gist:', error);
  }
};

export const useGitHubStore = create(
  persist<GitHubStore>(
    (set, get) => ({
      token: null,
      gistId: null,
      setToken: async (token) => {
        set((state) => ({ token, gistId: state.gistId || null }));
        if (!useGitHubStore.getState().gistId) {
          await fetchGistId(token);
        }
      },
      setGistId: (id) => set({ gistId: id }),
      clearGitHubData: () => set({ token: null, gistId: null }),
      backupToGitHub: async () => {
        const { data } = useRateStore.getState();
        const { token, gistId, setGistId } = get();

        if (!token) {
          console.error('GitHub token is missing!');
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'GitHub Error',
            text2: 'Token is missing!',
          });
          return;
        }

        const payload = {
          description: 'Rate Calculation Backup',
          public: false,
          files: {
            [GIST_FILENAME]: {
              content: JSON.stringify(data, null, 2),
            },
          },
        };

        try {
          let response;
          if (gistId) {
            // Update existing Gist
            response = await fetch(`https://api.github.com/gists/${gistId}`, {
              method: 'PATCH',
              headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json',
              },
              body: JSON.stringify(payload),
            });
          } else {
            // Create new Gist
            response = await fetch('https://api.github.com/gists', {
              method: 'POST',
              headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json',
              },
              body: JSON.stringify(payload),
            });
          }

          const result = await response.json();
          if (!gistId) {
            setGistId(result.id); // Save Gist ID if newly created
          }

          console.log('Backup successful:', result.html_url);
          Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Backup successful',
            text2: 'Data uploaded to GitHub!',
          });
          return result.html_url;
        } catch (error: any) {
          console.error('Backup failed:', error);
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Backup Failed',
            text2: error.message,
          });
        }
      },
      loadFromGitHub: async () => {
        const { token, gistId } = useGitHubStore.getState();
        if (!token || !gistId) {
          console.error('GitHub token or Gist ID is missing!');
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'GitHub Error',
            text2: 'Token or GistID is missing!',
          });
          return;
        }

        try {
          const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: {
              Authorization: `token ${token}`,
              Accept: 'application/vnd.github.v3+json',
            },
          });

          const result = await response.json();
          if (!result.files[GIST_FILENAME]) {
            console.error('Gist file not found!');
            Toast.show({
              type: 'error',
              position: 'top',
              text1: 'GitHub Error',
              text2: 'Gist file not found!',
            });
            return;
          }

          const newData: Record<string, Record<string, [number, number]>> = JSON.parse(
            result.files[GIST_FILENAME].content
          );

          // Update store with new data
          useRateStore.setState((state) => ({ ...state, data: newData }));

          // Recalculate totals after data update
          const newTotals: Record<string, number> = {};
          for (const month in newData) {
            newTotals[month] = Object.values(newData[month] || {}).reduce(
              (sum, [a1, a2]) => sum + a1 * 2.5 + a2 * 2,
              0
            );
          }

          useRateStore.setState((state) => ({ ...state, totals: newTotals }));

          console.log('Data successfully loaded and totals recalculated from GitHub Gist');
          Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Data Loaded',
            text2: 'Successfully fetched from GitHub',
          });
        } catch (error: any) {
          console.error('Loading failed:', error);
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Load Failed',
            text2: error.message,
          });
        }
      },
    }),
    {
      name: 'github-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
