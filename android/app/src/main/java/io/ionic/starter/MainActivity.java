package io.ionic.starter;

import com.getcapacitor.BridgeActivity;
import com.hemangkumar.capacitorgooglemaps.capacitorGoogleMaps;

public class MainActivity extends BridgeActivity {
    override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState); 

        // ...
        registerPlugin(capacitorGoogleMaps.class);
    }
}
