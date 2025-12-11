/**
 * Kenyan Counties, Constituencies, and Subcounties
 * Limited to 5 counties for prototyping
 */

export interface Subcounty {
  name: string
  wards?: string[]
}

export interface Constituency {
  name: string
  subcounties: Subcounty[]
}

export interface County {
  name: string
  constituencies: Constituency[]
}

export const PROTOTYPE_COUNTIES: County[] = [
  {
    name: 'Nairobi',
    constituencies: [
      {
        name: 'Westlands',
        subcounties: [
          { name: 'Westlands' },
          { name: 'Parklands' },
          { name: 'Kangemi' },
        ],
      },
      {
        name: 'Dagoretti North',
        subcounties: [
          { name: 'Kilimani' },
          { name: 'Kawangware' },
          { name: 'Gatina' },
        ],
      },
      {
        name: 'Dagoretti South',
        subcounties: [
          { name: 'Mutu-ini' },
          { name: 'Ngando' },
          { name: 'Riruta' },
        ],
      },
      {
        name: 'Langata',
        subcounties: [
          { name: 'Karen' },
          { name: 'Nairobi West' },
          { name: 'Mugumo-ini' },
        ],
      },
      {
        name: 'Kibra',
        subcounties: [
          { name: 'Laini Saba' },
          { name: 'Lindi' },
          { name: 'Makina' },
        ],
      },
      {
        name: 'Roysambu',
        subcounties: [
          { name: 'Githurai' },
          { name: 'Kahawa West' },
          { name: 'Zimmerman' },
        ],
      },
      {
        name: 'Kasarani',
        subcounties: [
          { name: 'Clay City' },
          { name: 'Mwiki' },
          { name: 'Njiru' },
        ],
      },
      {
        name: 'Ruaraka',
        subcounties: [
          { name: 'Baba Dogo' },
          { name: 'Utalii' },
          { name: 'Mathare North' },
        ],
      },
      {
        name: 'Embakasi South',
        subcounties: [
          { name: 'Imara Daima' },
          { name: 'Kwa Njenga' },
          { name: 'Kwa Reuben' },
        ],
      },
      {
        name: 'Embakasi North',
        subcounties: [
          { name: 'Kayole North' },
          { name: 'Kayole Central' },
          { name: 'Kayole South' },
        ],
      },
    ],
  },
  {
    name: 'Kiambu',
    constituencies: [
      {
        name: 'Gatundu South',
        subcounties: [
          { name: 'Gatundu' },
          { name: 'Gituamba' },
          { name: 'Kiamwangi' },
        ],
      },
      {
        name: 'Gatundu North',
        subcounties: [
          { name: 'Gatundu North' },
          { name: 'Gakoe' },
          { name: 'Githunguri' },
        ],
      },
      {
        name: 'Juja',
        subcounties: [
          { name: 'Juja' },
          { name: 'Witeithie' },
          { name: 'Kalimoni' },
        ],
      },
      {
        name: 'Thika Town',
        subcounties: [
          { name: 'Thika' },
          { name: 'Gatanga' },
          { name: 'Kamenu' },
        ],
      },
      {
        name: 'Ruiru',
        subcounties: [
          { name: 'Ruiru' },
          { name: 'Githurai' },
          { name: 'Kahawa Sukari' },
        ],
      },
      {
        name: 'Githunguri',
        subcounties: [
          { name: 'Githunguri' },
          { name: 'Githiga' },
          { name: 'Ikinu' },
        ],
      },
      {
        name: 'Kiambu',
        subcounties: [
          { name: 'Kiambu' },
          { name: 'Ting\'ang\'a' },
          { name: 'Cianda' },
        ],
      },
      {
        name: 'Kiambaa',
        subcounties: [
          { name: 'Karuri' },
          { name: 'Ndenderu' },
          { name: 'Muchatha' },
        ],
      },
      {
        name: 'Kabete',
        subcounties: [
          { name: 'Kabete' },
          { name: 'Uthiru' },
          { name: 'Muthiga' },
        ],
      },
      {
        name: 'Kikuyu',
        subcounties: [
          { name: 'Kikuyu' },
          { name: 'Karai' },
          { name: 'Nachu' },
        ],
      },
    ],
  },
  {
    name: 'Nakuru',
    constituencies: [
      {
        name: 'Nakuru Town West',
        subcounties: [
          { name: 'Barut' },
          { name: 'London' },
          { name: 'Kaptembwa' },
        ],
      },
      {
        name: 'Nakuru Town East',
        subcounties: [
          { name: 'Kapkures' },
          { name: 'Rhoda' },
          { name: 'Shaabab' },
        ],
      },
      {
        name: 'Subukia',
        subcounties: [
          { name: 'Subukia' },
          { name: 'Waseges' },
          { name: 'Kabazi' },
        ],
      },
      {
        name: 'Bahati',
        subcounties: [
          { name: 'Bahati' },
          { name: 'Dundori' },
          { name: 'Kabatini' },
        ],
      },
      {
        name: 'Gilgil',
        subcounties: [
          { name: 'Gilgil' },
          { name: 'Elementaita' },
          { name: 'Mbaruk' },
        ],
      },
      {
        name: 'Naivasha',
        subcounties: [
          { name: 'Naivasha' },
          { name: 'Maiella' },
          { name: 'Hellsgate' },
        ],
      },
      {
        name: 'Kuresoi North',
        subcounties: [
          { name: 'Kuresoi' },
          { name: 'Amalo' },
          { name: 'Tinet' },
        ],
      },
      {
        name: 'Kuresoi South',
        subcounties: [
          { name: 'Keringet' },
          { name: 'Kiptagich' },
          { name: 'Tinet' },
        ],
      },
      {
        name: 'Molo',
        subcounties: [
          { name: 'Molo' },
          { name: 'Elburgon' },
          { name: 'Mariashoni' },
        ],
      },
      {
        name: 'Njoro',
        subcounties: [
          { name: 'Njoro' },
          { name: 'Mau Narok' },
          { name: 'Mauche' },
        ],
      },
    ],
  },
  {
    name: 'Mombasa',
    constituencies: [
      {
        name: 'Changamwe',
        subcounties: [
          { name: 'Port Reitz' },
          { name: 'Kipevu' },
          { name: 'Airport' },
        ],
      },
      {
        name: 'Jomvu',
        subcounties: [
          { name: 'Jomvu Kuu' },
          { name: 'Miritini' },
          { name: 'Mikindani' },
        ],
      },
      {
        name: 'Kisauni',
        subcounties: [
          { name: 'Mjambere' },
          { name: 'Junda' },
          { name: 'Bamburi' },
        ],
      },
      {
        name: 'Nyali',
        subcounties: [
          { name: 'Frere Town' },
          { name: 'Ziwa La Ng\'ombe' },
          { name: 'Mkomani' },
        ],
      },
      {
        name: 'Likoni',
        subcounties: [
          { name: 'Timbwani' },
          { name: 'Shika Adabu' },
          { name: 'Bofu' },
        ],
      },
      {
        name: 'Mvita',
        subcounties: [
          { name: 'Mji Wa Kale' },
          { name: 'Tudor' },
          { name: 'Tononoka' },
        ],
      },
    ],
  },
  {
    name: 'Kisumu',
    constituencies: [
      {
        name: 'Kisumu Central',
        subcounties: [
          { name: 'Kisumu Central' },
          { name: 'Kajulu' },
          { name: 'Kolwa East' },
        ],
      },
      {
        name: 'Kisumu East',
        subcounties: [
          { name: 'Kajulu' },
          { name: 'Kolwa East' },
          { name: 'Manyatta' },
        ],
      },
      {
        name: 'Kisumu West',
        subcounties: [
          { name: 'West Kisumu' },
          { name: 'North West Kisumu' },
          { name: 'Central Kisumu' },
        ],
      },
      {
        name: 'Seme',
        subcounties: [
          { name: 'East Seme' },
          { name: 'West Seme' },
          { name: 'North Seme' },
        ],
      },
      {
        name: 'Nyando',
        subcounties: [
          { name: 'Awasi' },
          { name: 'Ombeyi' },
          { name: 'Masogo' },
        ],
      },
      {
        name: 'Muhoroni',
        subcounties: [
          { name: 'Muhoroni' },
          { name: 'Ombeyi' },
          { name: 'Masogo' },
        ],
      },
      {
        name: 'Nyakach',
        subcounties: [
          { name: 'South West Nyakach' },
          { name: 'North Nyakach' },
          { name: 'Central Nyakach' },
        ],
      },
    ],
  },
]

// Helper functions
export function getConstituenciesForCounty(countyName: string): Constituency[] {
  const county = PROTOTYPE_COUNTIES.find(c => c.name === countyName)
  return county?.constituencies || []
}

export function getSubcountiesForConstituency(
  countyName: string,
  constituencyName: string
): Subcounty[] {
  const county = PROTOTYPE_COUNTIES.find(c => c.name === countyName)
  const constituency = county?.constituencies.find(c => c.name === constituencyName)
  return constituency?.subcounties || []
}

export function getCountyNames(): string[] {
  return PROTOTYPE_COUNTIES.map(c => c.name)
}

