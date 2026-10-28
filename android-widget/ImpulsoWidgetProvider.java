package com.impulso.motivacion;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import java.util.Random;

public class ImpulsoWidgetProvider extends AppWidgetProvider {

    private static final String[][] DEFAULT_QUOTES = {
        {"No midas tu progreso con la regla de otra persona. Compite únicamente con quien eras ayer.", "Sabiduría Estoica"},
        {"La motivación te pone en marcha, pero es la disciplina la que te hace imparable cuando nadie te ve.", "Jim Ryun"},
        {"Tienes poder sobre tu mente, no sobre los eventos externos. Date cuenta de esto y encontrarás la fuerza.", "Marco Aurelio"},
        {"Has sobrevivido al 100% de tus días más difíciles. Tienes dentro de ti una resiliencia extraordinaria.", "Impulso Diario"},
        {"Somos lo que hacemos repetidamente. La excelencia no es un acto, sino un hábito.", "Aristóteles"}
    };

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        SharedPreferences prefs = context.getSharedPreferences("ImpulsoWidgetPrefs", Context.MODE_PRIVATE);
        int idx = new Random().nextInt(DEFAULT_QUOTES.length);
        String quote = prefs.getString("quote", DEFAULT_QUOTES[idx][0]);
        String author = prefs.getString("author", DEFAULT_QUOTES[idx][1]);

        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.impulso_widget);
            views.setTextViewText(R.id.widget_quote_text, "“" + quote + "”");
            views.setTextViewText(R.id.widget_author_text, "— " + author);

            Intent launchIntent = new Intent(context, MainActivity.class);
            PendingIntent pendingIntent = PendingIntent.getActivity(
                context, 0, launchIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}

