import { useRateStore } from '~/store/rateStore';
import { useGitHubStore } from '~/store/githubStore';
import Toast from 'react-native-toast-message';

const GIST_FILENAME = 'rate-data.json';

const loadFromGitHub = async () => {
        const { token, gistId } = useGitHubStore.getState();
        if (!token || !gistId) {
          console.error('GitHub token or Gist ID is missing!');
          Toast.show({ type: 'error', position: 'top', text1: 'GitHub Error', text2: 'Token or GistID is missing!' });
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
            Toast.show({ type: 'error', position: 'top', text1: 'GitHub Error', text2: 'Gist file not found!' });
            return;
          }
      
          const newData: Record<string, Record<string, [number, number]>> = JSON.parse(result.files[GIST_FILENAME].content);
          
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
          Toast.show({ type: 'success', position: 'top', text1: 'Data Loaded', text2: 'Successfully fetched from GitHub' });
        } catch (error: any) {
          console.error('Loading failed:', error);
          Toast.show({ type: 'error', position: 'top', text1: 'Load Failed', text2: error.message });
        }
      };


export default loadFromGitHub;