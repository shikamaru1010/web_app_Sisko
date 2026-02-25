**SPRINT 1**

&nbsp; datum: 10.02.2026;

&nbsp; vreme: 22:31h

1. Desktop verzija aplikacije:
   - Boja logoa da bude crvena , eventualno i ostali delovi gde je narandzasta bude crvena jer je crven logo, ili samo logo a ostalo neka ostane u drvenom stilu
   - sekcija popularna jela na pocetnoj stranici, neka slike budu malo vece
   - lokacija mesare je Краља Александра, Чајетина
   - broj od mesare je 031 3831068 i 064 12 14 024
   - radno vreme pokupi sa google preduzeca, kao sto ces povezati trenutne recenzije koje imaju na google-u i ispisati ih na sajtu.
   - svuda na sajtu gde pise na primer Najbolji rostilj na Zlatiboru ili bilo cemu tome slicnom sto je vezano za Zlatibor ( sem naravno za SEO u tim delovima je Zlatibor kljucan ) da prilagodis,izbacis ili dodas drugi tekst jer se lokal nalazi u Cajetini pa mi nije logicno da pise Najbolji rostilj na Zlatiboru
   - takodje promeniti neka pitanja u kvizovima ( omoguciti meni da promenim pitanja u neka normalna i smislena nema potrebe ti to da radis )
   - Dockerizovati aplikaciju ( vec imam instaliran docker )

---

**SPRINT 2**

&nbsp; datum: 11.02.2026;

&nbsp; vreme: TBD

1. Google Maps embed i lokacija:
   - Ažurirati iframe na lokacija stranici sa tačnim Google Maps embed kodom (Place ID za "Roštilj Šiško")
   - Ažurirati koordinate u constants.ts na tačne (lat: 43.7508477, lng: 19.718105)
   - Radi lokalno bez API ključa

2. Radno vreme sa Google Business Profile-a:
   - Prikupiti tačno radno vreme sa Google profila "Roštilj Šiško"
   - Ažurirati constants.ts sa pravim radnim vremenom (trenutno placeholder 08:00-22:00)

3. Google recenzije na sajtu:
   - Opcija A: Statičke recenzije — ručno prepisati 5-8 recenzija sa Google-a, prikazati u komponenti na početnoj stranici
   - Opcija B: Google Places API — dinamičko učitavanje recenzija (zahteva API ključ iz Google Cloud Console, .env.local fajl)
   - Potreban Google nalog za upravljanje Business Profile-om (ne mora Gmail, može poslovni email)

4. Email notifikacije za porudžbine:
   - Implementirati slanje email-a pri svakoj porudžbini (Resend API ili Nodemailer)
   - Porudžbina stiže na email vlasnika mesare
   - Testira se lokalno bez publish-a

5. Promeniti pitanja u kvizovima:
   - Klijent će specificirati koja pitanja da se zamene (u posebnom txt fajlu)

6. omoguciti narudzbine po delovima kilograma, da ne mora ceo nego moze npr 500gr

**SPRINT 3**

1. main crvena #A61C1C
2. u footeru da ne pise onaj tekst "Направљено са ... za Mesaru", nego "Предузеће основано 2007. године са јасним циљем и одлучношћу."
3. Takodje sem opcije da bira tacno kolicinski on moze da izabere bukvalno koliko ce komada cega u mesano sveze meso, na primer korisnik sajta hoce 2kg mesanog mesa ali hoce u to da idu ( 3 bataka, 2 pileca filea, 2 vrata, cevapa 5 i vrat)
4. Imas u folderu images sliku logoMesara.png koja predstavlja Logo preduzeca koji cemo zameniti sa trenutnim kao glavni logo preduzeca koji treba da se istakne i pokaze dugorocna istorija preduzeca

**SPRINT 4**

&nbsp; datum: 21.02.2026;

1. Rostilj na kilo - opcije tezine:
   - Smanjeno sa 4 opcije (250g, 500g, 750g, 1kg) na samo 2: 0.5kg i 1kg
   - Izmenjeno u: `src/components/menu/MenuItem.tsx` (WEIGHT_OPTIONS)
   - STATUS: ZAVRSENO

2. Hero Landing pozadinska slika:
   - Zamenjena `punRostilj.jpg` sa `ovalPomfLuk.jpg` (oval sa rostiljom)
   - Dodato `object-center` za centriranje na oval mesa
   - Izmenjeno u: `src/app/[locale]/page.tsx`
   - STATUS: ZAVRSENO

3. Pretraga menija - podrska za latinicu:
   - Dodata `latinToCyrillic()` funkcija za transliteraciju srpske latinice u cirilicu
   - Podrzani digrafi (lj, nj, dz, dj) i dijakritici (c, c, s, z, dj)
   - Korisnik moze kucati "cevap" i pronaci cirilicne stavke
   - Izmenjeno u: `src/app/[locale]/meni/page.tsx`
   - STATUS: ZAVRSENO

Claude Code automatizacije instalirane:

- CLAUDE.md azuriran sa tehnickim referencama
- .claude/settings.json kreiran (auto-lint hook, zastita osetljivih fajlova)
- context7 MCP server instaliran (dokumentacija uzivo za Next.js, Tailwind, itd.)
- Playwright MCP server instaliran (testiranje u pregledacu)
- localization-reviewer agent kreiran (provera prevoda sr/en)
- menu-validator agent kreiran (validacija podataka menija)
- .env.example kreiran (sablon za environment varijable)

**SPRINT 4**

Sprint 5 - Frontend zadaci za sajt mesare/restorana
Početna stranica: zameni sliku komplet lepinje sa kompletLepinjaWhiteBackground.jpg
Meni mesanog svežeg roštilja: ukloni opciju „Sastavi mesano“ (biranje mesa na komad)
Slike u celom meniju: dodaj profesionalnu sliku za svako jelo bez slike (po nazivu mesa/pice); u sekciji „Roštilj na kilo“ zameni slike za oblikovano juneće meso (ćevapi), rolovane ćevape, rolovanu piletinu i pileći file odgovarajućim slikama ispečenog mesa (sa interneta)
Pravila za slike:
• Roštilj na kilo → samo ispečeno meso
• Roštilj u lepinji → meso u lepinji sa začinima
• Dodaci i lepinje → zameni sliku lepinje sa kompletLepinjaWhiteBackground.jpg
Footer: znatno povećaj logo preduzeća

SPRINT 6

Laptop ekran:

FRONTEND:

UI/UX DESIGN review 23.02.2026.

      1.  Meni zameniti lose slike
      2.  Slika hero landing page ne valja --> uradjeno (25.02)
      3.  U meniju da se racuna popust na ukupnu cenu pri racunanju ogovarajucih kombo ponuda
      4.  Zameniti slike koje stoje na z pattern-u na stranici o nama ( sve 3 slike zameniti opcionalno ) --> uradjeno (25.02)
      5.  Stranica Galerija ( opcije jela i enterijer ) - prerasporediti odredjene slike i dodati neophodne koje imam na viberu -- strukturno dekomponovati stranicu galerija
      6.  Zabava pitanja ( pozabaviti se koje da stoji koje da se zameni )
      7.  Azurirati trenutno vreme rada ( mozda za google preduzeca mozda i ovako samo manuelno azuriratii)

Telefon ekran:

      1. Sekcija Pronadjite nas na pocetnoj stranici treba da budu oba tekst i ikonice pored njih u ravni ( isto udaljene od obe ivice a ne kao sto je trenutno ikonica mape i tekst sa njene desne strance vise uvucen.
