import { useRateStore } from '~/store/rateStore';
import { useGitHubStore } from '~/store/githubStore';
import Toast from 'react-native-toast-message';

const GIST_FILENAME = 'rate-data.json';

const backupToGitHub = async () => {
  const { data } = useRateStore.getState();
  const { token, gistId, setGistId } = useGitHubStore.getState();

  if (!token) {
    console.error('GitHub token is missing!');
    Toast.show({ type: 'error', position: 'top', text1: 'GitHub Error', text2: 'Token is missing!' });
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
    Toast.show({ type: 'success', position: 'top', text1: 'Backup successful', text2: 'Data uploaded to GitHub!' });
    return result.html_url;
  } catch (error: any) {
    console.error('Backup failed:', error);
    Toast.show({ type: 'error', position: 'top', text1: 'Backup Failed', text2: error.message });
  }
};


export default backupToGitHub;