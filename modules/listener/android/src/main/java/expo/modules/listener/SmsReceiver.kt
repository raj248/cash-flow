package expo.modules.listener

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.telephony.SmsMessage
import android.util.Log
import expo.modules.kotlin.modules.Module

class SmsReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == "android.provider.Telephony.SMS_RECEIVED") {
            val bundle = intent.extras
            if (bundle != null) {
                val pdus = bundle["pdus"] as Array<*>
                for (pdu in pdus) {
                    val sms = SmsMessage.createFromPdu(pdu as ByteArray)
                    val sender = sms.displayOriginatingAddress
                    val body = sms.messageBody
                    Log.d("SmsReceiver", "📩 SMS from $sender: $body")

                    // TODO: send to JS via ListenerModule
                }
            }
        }
    }
}
