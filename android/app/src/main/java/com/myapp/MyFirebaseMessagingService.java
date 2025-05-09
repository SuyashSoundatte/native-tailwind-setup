package com.myapp;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import me.leolin.shortcutbadger.ShortcutBadger;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    private static final String TAG = "MyFirebaseMsgService";

    @Override
    public void onNewToken(String token) {
        Log.d(TAG, "Refreshed token: " + token);
        // Optionally send token to your app server here
    }

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        Log.d(TAG, "From: " + remoteMessage.getFrom());

        String title = "New Notification";
        String body = "";
        int badgeCount = 0;

        if (remoteMessage.getNotification() != null) {
            title = remoteMessage.getNotification().getTitle() != null ? remoteMessage.getNotification().getTitle()
                    : title;
            body = remoteMessage.getNotification().getBody() != null ? remoteMessage.getNotification().getBody() : "";
        }

        if (remoteMessage.getData().containsKey("badge")) {
            try {
                badgeCount = Integer.parseInt(remoteMessage.getData().get("badge"));
            } catch (NumberFormatException e) {
                Log.w(TAG, "Invalid badge count format, defaulting to 0");
            }
        }

        showNotification(title, body, badgeCount);
    }

    private void showNotification(String title, String message, int badgeCount) {
        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        String channelId = "default_channel_id";

        // Create notification channel if needed (Android 8+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    channelId,
                    "Default Channel",
                    NotificationManager.IMPORTANCE_HIGH);
            notificationManager.createNotificationChannel(channel);
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channelId)
                .setSmallIcon(R.drawable.notification_icon) // Replace with your actual icon
                .setContentTitle(title)
                .setContentText(message)
                .setAutoCancel(true)
                .setNumber(badgeCount); // This sets the badge count on the notification

        notificationManager.notify(0, builder.build());

        // Update app icon badge (if supported by launcher)
        ShortcutBadger.applyCount(this, badgeCount);
    }
}
