const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withNotificationListener(config) {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];

    // Ensure service array exists
    mainApplication.service = mainApplication.service || [];
    mainApplication.receiver = mainApplication.receiver || [];

    // Add NotificationListenerService
    // mainApplication.service.push({
    //   $: {
    //     'android:name': 'expo.modules.listener.NotificationListener',
    //     'android:label': '@string/app_name',
    //     'android:permission': 'android.permission.BIND_NOTIFICATION_LISTENER_SERVICE',
    //     'android:exported': 'true',
    //   },
    //   'intent-filter': [
    //     {
    //       action: [
    //         {
    //           $: {
    //             'android:name': 'android.service.notification.NotificationListenerService',
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // });

    // Add SMS BroadcastReceiver
    mainApplication.receiver.push({
      $: {
        'android:name': 'expo.modules.listener.SmsReceiver',
        'android:exported': 'true',
        'android:permission': 'android.permission.BROADCAST_SMS',
      },
      'intent-filter': [
        {
          $: { 'android:priority': '999' }, // optional, high priority
          action: [{ $: { 'android:name': 'android.provider.Telephony.SMS_RECEIVED' } }],
        },
      ],
    });

    return config;
  });
};
