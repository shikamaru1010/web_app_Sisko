**SPRINT 1**

&nbsp;	datum: 10.02.2026;

&nbsp;	vreme: 22:31h



1. Desktop verzija aplikacije:
   	- Boja logoa da bude crvena (#D32F2F), eventualno i ostali delovi gde je narandzasta  bude crvena jer je crven logo, ili samo logo a ostalo neka ostane u drvenom stilu
   	- sekcija popularna jela na pocetnoj stranici, neka slike budu malo vece
   	- lokacija mesare je Краља Александра, Чајетина
   	- broj od mesare je 031 3831068 i 064 12 14 024
   	- radno vreme pokupi sa google preduzeca, kao sto ces povezati trenutne recenzije koje imaju na google-u i ispisati ih na sajtu.
   	- svuda na sajtu gde pise na primer Najbolji rostilj na Zlatiboru ili bilo cemu tome slicnom sto je vezano za Zlatibor ( sem naravno za SEO u tim delovima je Zlatibor kljucan ) da prilagodis,izbacis ili dodas drugi tekst jer se lokal nalazi u Cajetini pa mi nije logicno da pise Najbolji rostilj na Zlatiboru
   	- takodje promeniti neka pitanja u kvizovima ( omoguciti meni da promenim pitanja u neka normalna i smislena nema potrebe ti to da radis )
   	- Dockerizovati aplikaciju ( vec imam instaliran docker )

---

**SPRINT 2**

&nbsp;	datum: 11.02.2026;

&nbsp;	vreme: TBD

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
