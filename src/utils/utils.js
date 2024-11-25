
// utils.js or any other appropriate file
export async function getUserIp() {
    const response = await fetch('https://api64.ipify.org?format=json');
    const data = await response.json();
    const ip = data.ip;

    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geoResponse.json();

    return {
        ip: ip,
        country: geoData.country_name,
        region: geoData.region,
        city: geoData.city
    };
}
export async function fetchHtmlAsText(url) {
    const response = await fetch(url);
    return await response.text();
}
