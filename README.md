# Ev Kurası - Demo

Bu repo, front-end odaklı bir "Ev Kurası" demo projesidir. Gerçek başvuru veya çekiliş yapmaz; demo amaçlıdır.

Özellikler
- Responsive HTML/CSS/Vanilla JS
- Başvuru formu (localStorage'da saklanır)
- Başvuru sonrası onay ekranı (Katılım numarası + QR)
- Geri sayım sayacı
- Katılım sorgulama
- Yönetici paneli (demo şifre: `demo1234`) — başvuruları listeleme, düzenleme, silme, CSV dışa aktarma, çekilişi başlatma (rastgele)
- Karanlık mod
- Animasyonlar, toast mesajları, temel yükleme/UX

Dosya yapısı
- index.html
- style.css
- script.js
- admin.html
- assets/ (logo, hero görselleri, icons)

Çalıştırma
1. Bu dosyaları bir klasöre koyun.
2. `index.html` dosyasını tarayıcıda açın veya bir yerel sunucu kullanın:
   - Python 3: `python -m http.server 8000` (dizin içinde çalıştırın) → http://localhost:8000
3. GitHub Pages ile yayınlamak için:
   - Bu klasörü bir GitHub deposuna ekleyin ve Pages ayarlarından `main` (veya default) branch'ı seçin.

Notlar
- Tüm veriler tarayıcı localStorage üzerinde tutulur.
- Demo şifreleri ve kritik işlemler üretim için uygun değildir.
- Gerçek bir çekiliş/başvuru sistemi için sunucu tarafı doğrulama, kimlik doğrulama ve veri tabanı gereklidir.
