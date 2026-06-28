# TaskuRutiini Android APK

Tämä kansio sisältää Android APK -version TaskuRutiinista. Sovellus avaa TaskuRutiinin Android WebView -sovelluksena, joten se voidaan asentaa puhelimeen APK-tiedostona.

## Plus omistajalle

Omistajan Plus-koodi:

```text
OMISTAJA-2026
```

## Helpoin APK-build ilman Android Studiota

1. Luo tyhjä GitHub-repo.
2. Lataa tämän kansion tiedostot repoon.
3. Avaa GitHubissa **Actions**.
4. Käynnistä workflow **Build Android APK**.
5. Lataa valmis `TaskuRutiini-debug-apk` artifact.
6. Siirrä `.apk` Android-puhelimeen ja avaa se.

Puhelin voi kysyä lupaa asentaa tuntemattomasta lähteestä. Salli se vain omalle APK:llesi.

## Paikallinen build Android Studiolla

Jos sinulla on Android Studio:

```bash
./gradlew assembleDebug
```

Valmis APK löytyy:

```text
app/build/outputs/apk/debug/app-debug.apk
```

## Myynti Google Playssa

Debug APK sopii omaan testiin. Asiakkaille myyntiä varten julkaise sovellus Google Play Consoleen ja kytke Plus Google Play Billing -tilaukseen.
