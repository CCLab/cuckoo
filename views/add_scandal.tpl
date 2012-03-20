<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{title}}</title>
    <link rel="stylesheet" type="text/css" href="/static/css/style.css" />
    <link rel="stylesheet" type="text/css" href="/static/css/jquery-ui-1.8.18.custom.css" />
    <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Pontano+Sans&subset=latin,latin-ext">
    <script src="/static/js/jquery-1.7.1.min.js"></script>
    <script src="/static/js/jquery-ui-1.8.18.custom.min.js"></script>
    <script src="/static/js/forms.js"></script>
</head>
<body>
    <header>
        <h1>Dodaj aferę</h1>
        <p>Formularz dodawania afery</p>
    </header>
    <section>
        <div id="dialog-scandal"></div>
        <form action="/add-scandal" method="post" id="form-add-scandal">
            <fieldset>
                <legend>Stosowane nazwy afery</legend>
                <input type="text" name="name-1" id="name-1" />
                <br><input type="text" name="name-2" id="name-2" />
                <br><input type="text" name="name-3" id="name-3" />
            </fieldset>
            <fieldset>
                <legend>Skondensowany opis</legend>
                <textarea name="description" rows="8" cols="50"></textarea>
            </fieldset>
            <fieldset>
                <legend>Chronologia</legend>
                <p>Dodanie wydarzeń możliwe po dodaniu afery</p>
            </fieldset>
            <fieldset>
                <legend>Rodzaj korupcji</legend>
                <input type="checkbox" name="type-coi"> <label for="type-coi">konflikt interesów</label>
                <br><input type="checkbox" name="type-bribe"> <label for="type-bribe">łapówkarstwo</label>
                <br><input type="checkbox" name="type-nepotism"> <label for="type-nepotism">nepotyzm, kumoterstwo</label>
                <br><input type="checkbox" name="type-appropriation"> <label for="type-appropriation">zawłaszczanie państwa</label>
                <br><input type="checkbox" name="type-embezzelment"> <label for="type-embezzelment">sprzeniewierzenie się obowiązkom / działanie na szkodę dobra społecznego</label>
                <br><input type="checkbox" name="type-election"> <label for="type-election">korupcja wyborcza</label>
                <br><input type="checkbox" name="type-lobbying"> <label for="type-lobbying">nielegalny/nieuczciwy lobbing</label>
                <br><input type="checkbox" name="type-impacts"> <label for="type-impacts">kupczenie wpływami</label>
                <br><input type="checkbox" name="type-party"> <label for="type-party">upartyjnienie państwa</label>
            </fieldset>
            <fieldset>
                <legend>Główni bohaterowie</legend>
                <table>
                    <thead>
                        <tr>
                            <td>Imię</td>
                            <td>Nazwisko</td>
                            <td>Opis</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" name="character-1-name"></td>
                            <td><input type="text" name="character-1-surname"></td>
                            <td><input type="text" name="character-1-description"></td>
                        </tr>
                        <tr>
                            <td><input type="text" name="character-2-name"></td>
                            <td><input type="text" name="character-2-surname"></td>
                            <td><input type="text" name="character-2-description"></td>
                        </tr>
                        <tr>
                            <td><input type="text" name="character-3-name"></td>
                            <td><input type="text" name="character-3-surname"></td>
                            <td><input type="text" name="character-3-description"></td>
                        </tr>
                        <tr>
                            <td><input type="text" name="character-4-name"></td>
                            <td><input type="text" name="character-4-surname"></td>
                            <td><input type="text" name="character-4-description"></td>
                        </tr>
                        <tr>
                            <td><input type="text" name="character-5-name"></td>
                            <td><input type="text" name="character-5-surname"></td>
                            <td><input type="text" name="character-5-description"></td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
            <fieldset>
                <legend>Zamieszane partie</legend>
                <input type="checkbox" name="party-po"> <label for="party-po">PO</label>
                <br><input type="checkbox" name="party-sld"> <label for="party-sld">SLD</label>
                <br><input type="checkbox" name="party-pis"> <label for="party-pis">PiS</label>
                <br><input type="checkbox" name="party-psl"> <label for="party-psl">PSL</label>
                <br><input type="checkbox" name="party-samoobrona"> <label for="party-samoobrona">Samoobrona</label>
                <br><input type="checkbox" name="party-kld"> <label for="party-kld">KLD</label>
                <br><input type="checkbox" name="party-lpr"> <label for="party-lpr">LPR</label>
                <br><input type="checkbox" name="party-aws"> <label for="party-aws">AWS</label>
                <br><input type="checkbox" name="party-uw"> <label for="party-uw">UW</label>
                <br><input type="checkbox" name="party-sdrp"> <label for="party-sdrp">SdRP</label>
            </fieldset>
            <fieldset>
                <legend>Służby/instytucje strażnicze i śledcze oraz sądowe, które miały udział lub reagowały na aferę (nie jako sprawca)</legend>
                <input type="checkbox" name="contributor-abw"> <label for="contributor-abw">ABW</label>
                <br><input type="checkbox" name="contributor-police"> <label for="contributor-police">policja</label>
                <br><input type="checkbox" name="contributor-cba"> <label for="contributor-cba">CBA</label>
                <br><input type="checkbox" name="contributor-prosecutors-office"> <label for="contributor-prosecutors-office">prokuratura</label>
                <br><input type="checkbox" name="contributor-nik"> <label for="contributor-nik">NIK</label>
                <br><input type="checkbox" name="contributor-treasury-intelligence"> <label for="contributor-treasury-intelligence">wywiad skarbowy</label>
                <br><input type="checkbox" name="contributor-cbs"> <label for="contributor-cbs">CBŚ</label>
                <br><input type="checkbox" name="contributor-judicary"> <label for="contributor-judicary">sądownictwo</label>
                <br><input type="checkbox" name="contributor-prime-minister"> <label for="contributor-prime-minister">premier</label>
                <br><input type="checkbox" name="contributor-court-of-inquiry"> <label for="contributor-court-of-inquiry">specjalna komisja śledcza</label>
                <br><input type="checkbox" name="contributor-pitera"> <label for="contributor-pitera">Julia Pitera (pełnomocnik ds. korupcji)</label>
            </fieldset>
            <fieldset>
                <legend>Instytucja/urząd dotknięte korupcją/oskarżone o korupcję</legend>
                <input type="checkbox" name="bribed-local"> <label for="bribed-local">obierane władze lokalne</label>
                <br><input type="checkbox" name="bribed-military"> <label for="bribed-military">wojsko (poniżej poziomu lokalnego)</label>
                <br><input type="checkbox" name="bribed-police"> <label for="bribed-police">policja i służby policyjne (CBŚ, etc.)</label>
                <br><input type="checkbox" name="bribed-lower"> <label for="bribed-lower">urząd centralny (urzędnicy ministerialni niższego szczebla lub pracownicy urzędów jak urząd rejestracji leków)</label>
                <br><input type="checkbox" name="bribed-higher"> <label for="bribed-higher">polityk w randze najwyższego urzędnika (premier, minister, etc. do wiceministra/sekretarza stanu)</label>
                <br><input type="checkbox" name="bribed-health"> <label for="bribed-health">służba zdrowia</label>
                <br><input type="checkbox" name="bribed-mp"> <label for="bribed-mp">parlamentarzysta</label>
                <br><input type="checkbox" name="bribed-treasury"> <label for="bribed-treasury">skarbówka</label>
                <br><input type="checkbox" name="bribed-businessman"> <label for="bribed-businessman">biznesmen</label>
                <br><input type="checkbox" name="bribed-minor-official"> <label for="bribed-minor-official">urzędnik lokalny</label>
            </fieldset>
            <fieldset>
                <legend>Sfera dotknięta korupcją (od strony instytucji państwowych)</legend>
                <input type="checkbox" name="domain-real-estate"> <label for="domain-real-estate">gospodarowanie nieruchomościami</label>
                <br><input type="checkbox" name="domain-spatial"> <label for="domain-spatial">zagospodarowanie przestrzenne</label>
                <br><input type="checkbox" name="domain-call-for-bids"> <label for="domain-call-for-bids">przetarg/zamówienia publiczne</label>
                <br><input type="checkbox" name="domain-legislation-government"> <label for="domain-legislation-government">uchwalanie prawa poziom rządowy</label>
                <br><input type="checkbox" name="domain-legislation-parliment"> <label for="domain-legislation-parliment">uchwalanie prawa poziom sejmu</label>
                <br><input type="checkbox" name="domain-regulation"> <label for="domain-regulation">wydawanie rozporządzeń</label>
                <br><input type="checkbox" name="domain-grants"> <label for="domain-grants">przyznawanie dotacji, zwolnień i umorzeń podatkowych, pomocy państwowej</label>
                <br><input type="checkbox" name="domain-public-property"> <label for="domain-public-property">gospodarowanie mieniem publicznym i państwowym inne niż nieruchomości (w tym zarządzanie spółkami skarbu państwa, przedsiębiorstwami państwowymi, etc)</label>
                <br><input type="checkbox" name="domain-other"> <label for="domain-other">inna decyzja administracyjna (prywatyzacja, wpisanie na listę leków refundowanych, przeniesienie rozprawy do "przychylnego sądu"</label>
                <br><input type="checkbox" name="domain-nepotism"> <label for="domain-nepotism">zatrudnianie członków rodziny lub znajomych</label>
            </fieldset>
            <fieldset>
                <legend>Reakcja instytucji państwowych na aferę</legend>
                <input type="checkbox" name="response-none"> <label for="response-none">brak reakcji</label>
                <br><input type="checkbox" name="response-internal-investigation"> <label for="response-internal-investigation">wewnętrzne dochodzenie w dotkniętej instytucji</label>
                <br><input type="checkbox" name="response-nik"> <label for="response-nik">kontrola instytucji zwierzchnich lub NIK</label>
                <br><input type="checkbox" name="response-suspension"> <label for="response-suspension">zawieszenie w czynnościach/zwolnienie oskarżonego o korupcję</label>
                <br><input type="checkbox" name="response-dismissal"> <label for="response-dismissal">zdymisjonowanie zwierzchnika/zwierzchników oskarżonego</label>
                <br><input type="checkbox" name="response-resignation"> <label for="response-resignation">podanie się do dymisji zwierzchników/zwierzchnika oskarżonego</label>
                <br><input type="checkbox" name="response-police-investigation"> <label for="response-police-investigation">śledztwo policji lub innych służb policyjnych</label>
                <br><input type="checkbox" name="response-prosecutors-investigation"> <label for="response-prosecutors-investigation">śledztwo prokuratorskie</label>
                <br><input type="checkbox" name="response-court-of-inquiry"> <label for="response-court-of-inquiry">powołanie specjalnej komisji śledczej</label>
                <br><input type="checkbox" name="response-proceedings"> <label for="response-proceedings">wszczęcie postępowania sądowego</label>
                <br><input type="checkbox" name="response-lack-of-evidence"> <label for="response-lack-of-evidence">umorzenie z braku dowodów</label>
                <br><input type="checkbox" name="response-expiration"> <label for="response-expiration">umorzenie z powodu przedawnienia</label>
                <br><input type="checkbox" name="response-conviction"> <label for="response-conviction">skazanie</label>
                <br><input type="checkbox" name="response-acquittal"> <label for="response-acquittal">uniewinnienie</label>
            </fieldset>
            <fieldset>
                <legend>Szersze konsekwencje afery</legend>
                <input type="checkbox" name="effects-none"> <label for="effects-none">brak</label>
                <br><input type="checkbox" name="effects-process"> <label for="effects-process">zmiana praktyki załatwiania spraw w instytucji</label>
                <br><input type="checkbox" name="effects-control"> <label for="effects-control">wprowadzenie dokładniejszego nadzoru nad instytucją</label>
                <br><input type="checkbox" name="effects-law"> <label for="effects-law">wprowadzenie zmian w prawie</label>
            </fieldset>
            <fieldset>
                <legend>Kto jako pierwszy poinformował opinię publiczną o aferze/nagłośnił sprawę</legend>
                <input type="checkbox" name="publicize-media"> <label for="publicize-media">media</label>
                <br><input type="checkbox" name="publicize-politician"> <label for="publicize-politician">polityk</label>
                <br><input type="checkbox" name="publicize-police"> <label for="publicize-police">policja</label>
                <br><input type="checkbox" name="publicize-prosecutors-office"> <label for="publicize-prosecutors-office">prokuratura</label>
                <br><input type="checkbox" name="publicize-nik"> <label for="publicize-nik">NIK</label>
                <br><input type="checkbox" name="publicize-whistleblower"> <label for="publicize-whistleblower">whistleblower z dotkniętej instytucji</label>
                <br><input type="checkbox" name="publicize-other"> <label for="publicize-other">inne instytucje kontrolne</label>
            </fieldset>
            <input type="submit" value="Dodaj" /> <a href="/">Anuluj</a>
        </form>
    </section>
</body>
