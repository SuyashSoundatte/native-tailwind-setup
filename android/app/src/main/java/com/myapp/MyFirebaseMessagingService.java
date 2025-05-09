package com.yourapp;

import android.util.Log;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    private static final String TAG = "MyFirebaseMsgService";

    @Override
    public void onNewToken(String token) {
        Log.d(TAG, "Refreshed token: " + token);
    }

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Log.d(TAG, "From: " + remoteMessage.getFrom());
        
        if (remoteMessage.getNotification() != null) {
            Log.d(TAG, "Message Notification Body: " + remoteMessage.getNotification().getBody());
        }
    }

    @Override
public void onMessageReceived(RemoteMessage remoteMessage) {
    super.onMessageReceived(remoteMessage);
    
    // Extract notification data
    if (remoteMessage.getNotification() != null) {
        String title = remoteMessage.getNotification().getTitle();
        String body = remoteMessage.getNotification().getBody();
        int badgeCount = remoteMessage.getData().get("badge") != null 
            ? Integer.parseInt(remoteMessage.getData().get("badge")) 
            : 0; // Default to 0 if badge not provided

        // Display notification with badge count
        showNotification(title, body, badgeCount);
    }
}

    private void showNotification(String title, String message, int badgeCount) {
    NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
    
    // Create notification channel (required for Android 8.0+)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        NotificationChannel channel = new NotificationChannel(
            "default_channel_id",
            "Default Channel",
            NotificationManager.IMPORTANCE_HIGH
        );
        notificationManager.createNotificationChannel(channel);
    }

    // Build notification
    NotificationCompat.Builder builder = new NotificationCompat.Builder(this, "default_channel_id")
        .setSmallIcon(R.drawable.notification_icon) // Replace with your icon
        .setContentTitle(title)
        .setContentText(message)
        .setAutoCancel(true)
        .setNumber(badgeCount); // Set badge count

    // Show notification
    notificationManager.notify(0, builder.build());

    // Update app badge (works on some devices)
    ShortcutBadger.applyCount(this, badgeCount);
}
}