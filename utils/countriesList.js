/* eslint-disable max-lines */
const countriesList = [
  {
    label: 'Afghanistan',
    officialName: 'The Islamic Republic of Afghanistan',
    value: 'AF'
  },
  {
    label: 'Albania',
    officialName: 'The Republic of Albania',
    value: 'AL'
  },
  {
    label: 'Algeria',
    officialName: 'The People\'s Democratic Republic of Algeria',
    value: 'DZ'
  },
  {
    label: 'Andorra',
    officialName: 'The Principality of Andorra',
    value: 'AD'
  },
  {
    label: 'Angola',
    officialName: 'The Republic of Angola',
    value: 'AO'
  },
  {
    label: 'Antigua and Barbuda',
    officialName: 'Antigua and Barbuda',
    value: 'AG'
  },
  {
    label: 'Argentina',
    officialName: 'The Argentine Republic',
    value: 'AR'
  },
  {
    label: 'Armenia',
    officialName: 'The Republic of Armenia',
    value: 'AM'
  },
  {
    label: 'Australia',
    officialName: 'The Commonwealth of Australia',
    value: 'AU'
  },
  {
    label: 'Austria',
    officialName: 'The Republic of Austria',
    value: 'AT'
  },
  {
    label: 'Azerbaijan',
    officialName: 'The Republic of Azerbaijan',
    value: 'AZ'
  },
  {
    label: 'Bahrain',
    officialName: 'The Kingdom of Bahrain',
    value: 'BH'
  },
  {
    label: 'Bangladesh',
    officialName: 'The People\'s Republic of Bangladesh',
    value: 'BD'
  },
  {
    label: 'Barbados',
    officialName: 'Barbados',
    value: 'BB'
  },
  {
    label: 'Belarus',
    officialName: 'The Republic of Belarus',
    value: 'BY'
  },
  {
    label: 'Belgium',
    officialName: 'The Kingdom of Belgium',
    value: 'BE'
  },
  {
    label: 'Belize',
    officialName: 'Belize',
    value: 'BZ'
  },
  {
    label: 'Benin',
    officialName: 'The Republic of Benin',
    value: 'BJ'
  },
  {
    label: 'Bhutan',
    officialName: 'The Kingdom of Bhutan',
    value: 'BT'
  },
  {
    label: 'Bolivia',
    officialName: 'The Plurinational State of Bolivia',
    value: 'BO'
  },
  {
    label: 'Bosnia and Herzegovina',
    officialName: 'Bosnia and Herzegovina',
    value: 'BA'
  },
  {
    label: 'Botswana',
    officialName: 'The Republic of Botswana',
    value: 'BW'
  },
  {
    label: 'Brazil',
    officialName: 'The Federative Republic of Brazil',
    value: 'BR'
  },
  {
    label: 'Brunei',
    officialName: 'Brunei Darussalam',
    value: 'BN'
  },
  {
    label: 'Bulgaria',
    officialName: 'The Republic of Bulgaria',
    value: 'BG'
  },
  {
    label: 'Burkina Faso',
    officialName: 'Burkina Faso',
    value: 'BF'
  },
  {
    label: 'Burundi',
    officialName: 'The Republic of Burundi',
    value: 'BI'
  },
  {
    label: 'Cambodia',
    officialName: 'The Kingdom of Cambodia',
    value: 'KH'
  },
  {
    label: 'Cameroon',
    officialName: 'The Republic of Cameroon',
    value: 'CM'
  },
  {
    label: 'Canada',
    officialName: 'Canada',
    value: 'CA'
  },
  {
    label: 'Cape Verde',
    officialName: 'The Republic of Cabo Verde',
    value: 'CV'
  },
  {
    label: 'Central African Republic',
    officialName: 'The Central African Republic',
    value: 'CF'
  },
  {
    label: 'Chad',
    officialName: 'The Republic of Chad',
    value: 'TD'
  },
  {
    label: 'Chile',
    officialName: 'The Republic of Chile',
    value: 'CL'
  },
  {
    label: 'China',
    officialName: 'The People\'s Republic of China',
    value: 'CN'
  },
  {
    label: 'Colombia',
    officialName: 'The Republic of Colombia',
    value: 'CO'
  },
  {
    label: 'Comoros',
    officialName: 'The Union of the Comoros',
    value: 'KM'
  },
  {
    label: 'Congo',
    officialName: 'The Republic of the Congo',
    value: 'CG'
  },
  {
    label: 'Congo (Democratic Republic)',
    officialName: 'The Democratic Republic of the Congo',
    value: 'CD'
  },
  {
    label: 'Costa Rica',
    officialName: 'The Republic of Costa Rica',
    value: 'CR'
  },
  {
    label: 'Croatia',
    officialName: 'The Republic of Croatia',
    value: 'HR'
  },
  {
    label: 'Cuba',
    officialName: 'The Republic of Cuba',
    value: 'CU'
  },
  {
    label: 'Cyprus',
    officialName: 'The Republic of Cyprus',
    value: 'CY'
  },
  {
    label: 'Czechia',
    officialName: 'The Czech Republic',
    value: 'CZ'
  },
  {
    label: 'Denmark',
    officialName: 'The Kingdom of Denmark',
    value: 'DK'
  },
  {
    label: 'Djibouti',
    officialName: 'The Republic of Djibouti',
    value: 'DJ'
  },
  {
    label: 'Dominica',
    officialName: 'The Commonwealth of Dominica',
    value: 'DM'
  },
  {
    label: 'Dominican Republic',
    officialName: 'The Dominican Republic',
    value: 'DO'
  },
  {
    label: 'East Timor',
    officialName: 'The Democratic Republic of Timor-Leste',
    value: 'TL'
  },
  {
    label: 'Ecuador',
    officialName: 'The Republic of Ecuador',
    value: 'EC'
  },
  {
    label: 'Egypt',
    officialName: 'The Arab Republic of Egypt',
    value: 'EG'
  },
  {
    label: 'El Salvador',
    officialName: 'The Republic of El Salvador',
    value: 'SV'
  },
  {
    label: 'Equatorial Guinea',
    officialName: 'The Republic of Equatorial Guinea',
    value: 'GQ'
  },
  {
    label: 'Eritrea',
    officialName: 'The State of Eritrea',
    value: 'ER'
  },
  {
    label: 'Estonia',
    officialName: 'The Republic of Estonia',
    value: 'EE'
  },
  {
    label: 'Eswatini',
    officialName: 'Kingdom of Eswatini',
    value: 'SZ'
  },
  {
    label: 'Ethiopia',
    officialName: 'The Federal Democratic Republic of Ethiopia',
    value: 'ET'
  },
  {
    label: 'Fiji',
    officialName: 'The Republic of Fiji',
    value: 'FJ'
  },
  {
    label: 'Finland',
    officialName: 'The Republic of Finland',
    value: 'FI'
  },
  {
    label: 'France',
    officialName: 'The French Republic',
    value: 'FR'
  },
  {
    label: 'Gabon',
    officialName: 'The Gabonese Republic',
    value: 'GA'
  },
  {
    label: 'Georgia',
    officialName: 'Georgia',
    value: 'GE'
  },
  {
    label: 'Germany',
    officialName: 'The Federal Republic of Germany',
    value: 'DE'
  },
  {
    label: 'Ghana',
    officialName: 'The Republic of Ghana',
    value: 'GH'
  },
  {
    label: 'Greece',
    officialName: 'The Hellenic Republic',
    value: 'GR'
  },
  {
    label: 'Grenada',
    officialName: 'Grenada',
    value: 'GD'
  },
  {
    label: 'Guatemala',
    officialName: 'The Republic of Guatemala',
    value: 'GT'
  },
  {
    label: 'Guinea',
    officialName: 'The Republic of Guinea',
    value: 'GN'
  },
  {
    label: 'Guinea-Bissau',
    officialName: 'The Republic of Guinea-Bissau',
    value: 'GW'
  },
  {
    label: 'Guyana',
    officialName: 'The Co-operative Republic of Guyana',
    value: 'GY'
  },
  {
    label: 'Haiti',
    officialName: 'The Republic of Haiti',
    value: 'HT'
  },
  {
    label: 'Honduras',
    officialName: 'The Republic of Honduras',
    value: 'HN'
  },
  {
    label: 'Hungary',
    officialName: 'Hungary',
    value: 'HU'
  },
  {
    label: 'Iceland',
    officialName: 'Iceland',
    value: 'IS'
  },
  {
    label: 'India',
    officialName: 'The Republic of India',
    value: 'IN'
  },
  {
    label: 'Indonesia',
    officialName: 'The Republic of Indonesia',
    value: 'ID'
  },
  {
    label: 'Iran',
    officialName: 'The Islamic Republic of Iran',
    value: 'IR'
  },
  {
    label: 'Iraq',
    officialName: 'The Republic of Iraq',
    value: 'IQ'
  },
  {
    label: 'Ireland',
    officialName: 'Ireland',
    value: 'IE'
  },
  {
    label: 'Israel',
    officialName: 'The State of Israel',
    value: 'IL'
  },
  {
    label: 'Italy',
    officialName: 'The Italian Republic',
    value: 'IT'
  },
  {
    label: 'Ivory Coast',
    officialName: 'The Republic of Côte D’Ivoire',
    value: 'CI'
  },
  {
    label: 'Jamaica',
    officialName: 'Jamaica',
    value: 'JM'
  },
  {
    label: 'Japan',
    officialName: 'Japan',
    value: 'JP'
  },
  {
    label: 'Jordan',
    officialName: 'The Hashemite Kingdom of Jordan',
    value: 'JO'
  },
  {
    label: 'Kazakhstan',
    officialName: 'The Republic of Kazakhstan',
    value: 'KZ'
  },
  {
    label: 'Kenya',
    officialName: 'The Republic of Kenya',
    value: 'KE'
  },
  {
    label: 'Kiribati',
    officialName: 'The Republic of Kiribati',
    value: 'KI'
  },
  {
    label: 'Kosovo',
    officialName: 'The Republic of Kosovo',
    value: 'XK'
  },
  {
    label: 'Kuwait',
    officialName: 'The State of Kuwait',
    value: 'KW'
  },
  {
    label: 'Kyrgyzstan',
    officialName: 'The Kyrgyz Republic',
    value: 'KG'
  },
  {
    label: 'Laos',
    officialName: 'The Lao People\'s Democratic Republic',
    value: 'LA'
  },
  {
    label: 'Latvia',
    officialName: 'The Republic of Latvia',
    value: 'LV'
  },
  {
    label: 'Lebanon',
    officialName: 'The Lebanese Republic',
    value: 'LB'
  },
  {
    label: 'Lesotho',
    officialName: 'The Kingdom of Lesotho',
    value: 'LS'
  },
  {
    label: 'Liberia',
    officialName: 'The Republic of Liberia',
    value: 'LR'
  },
  {
    label: 'Libya',
    officialName: 'State of Libya',
    value: 'LY'
  },
  {
    label: 'Liechtenstein',
    officialName: 'The Principality of Liechtenstein',
    value: 'LI'
  },
  {
    label: 'Lithuania',
    officialName: 'The Republic of Lithuania',
    value: 'LT'
  },
  {
    label: 'Luxembourg',
    officialName: 'The Grand Duchy of Luxembourg',
    value: 'LU'
  },
  {
    label: 'Madagascar',
    officialName: 'The Republic of Madagascar',
    value: 'MG'
  },
  {
    label: 'Malawi',
    officialName: 'The Republic of Malawi',
    value: 'MW'
  },
  {
    label: 'Malaysia',
    officialName: 'Malaysia',
    value: 'MY'
  },
  {
    label: 'Maldives',
    officialName: 'The Republic of Maldives',
    value: 'MV'
  },
  {
    label: 'Mali',
    officialName: 'The Republic of Mali',
    value: 'ML'
  },
  {
    label: 'Malta',
    officialName: 'The Republic of Malta',
    value: 'MT'
  },
  {
    label: 'Marshall Islands',
    officialName: 'The Republic of the Marshall Islands',
    value: 'MH'
  },
  {
    label: 'Mauritania',
    officialName: 'The Islamic Republic of Mauritania',
    value: 'MR'
  },
  {
    label: 'Mauritius',
    officialName: 'The Republic of Mauritius',
    value: 'MU'
  },
  {
    label: 'Mexico',
    officialName: 'The United Mexican States',
    value: 'MX'
  },
  {
    label: 'Federated States of Micronesia',
    officialName: 'Federated States of Micronesia',
    value: 'FM'
  },
  {
    label: 'Moldova',
    officialName: 'The Republic of Moldova',
    value: 'MD'
  },
  {
    label: 'Monaco',
    officialName: 'The Principality of Monaco',
    value: 'MC'
  },
  {
    label: 'Mongolia',
    officialName: 'Mongolia',
    value: 'MN'
  },
  {
    label: 'Montenegro',
    officialName: 'Montenegro',
    value: 'ME'
  },
  {
    label: 'Morocco',
    officialName: 'The Kingdom of Morocco',
    value: 'MA'
  },
  {
    label: 'Mozambique',
    officialName: 'The Republic of Mozambique',
    value: 'MZ'
  },
  {
    label: 'Myanmar (Burma)',
    officialName: 'The Republic of the Union of Myanmar',
    value: 'MM'
  },
  {
    label: 'Namibia',
    officialName: 'The Republic of Namibia',
    value: 'NA'
  },
  {
    label: 'Nauru',
    officialName: 'The Republic of Nauru',
    value: 'NR'
  },
  {
    label: 'Nepal',
    officialName: 'Nepal',
    value: 'NP'
  },
  {
    label: 'Netherlands',
    officialName: 'The Kingdom of the Netherlands',
    value: 'NL'
  },
  {
    label: 'New Zealand',
    officialName: 'New Zealand',
    value: 'NZ'
  },
  {
    label: 'Nicaragua',
    officialName: 'The Republic of Nicaragua',
    value: 'NI'
  },
  {
    label: 'Niger',
    officialName: 'The Republic of Niger',
    value: 'NE'
  },
  {
    label: 'Nigeria',
    officialName: 'The Federal Republic of Nigeria',
    value: 'NG'
  },
  {
    label: 'North Korea',
    officialName: 'The Democratic People\'s Republic of Korea',
    value: 'KP'
  },
  {
    label: 'North Macedonia',
    officialName: 'Republic of North Macedonia',
    value: 'MK'
  },
  {
    label: 'Norway',
    officialName: 'The Kingdom of Norway',
    value: 'NO'
  },
  {
    label: 'Oman',
    officialName: 'The Sultanate of Oman',
    value: 'OM'
  },
  {
    label: 'Pakistan',
    officialName: 'The Islamic Republic of Pakistan',
    value: 'PK'
  },
  {
    label: 'Palau',
    officialName: 'The Republic of Palau',
    value: 'PW'
  },
  {
    label: 'Panama',
    officialName: 'The Republic of Panama',
    value: 'PA'
  },
  {
    label: 'Papua New Guinea',
    officialName: 'The Independent State of Papua New Guinea',
    value: 'PG'
  },
  {
    label: 'Paraguay',
    officialName: 'The Republic of Paraguay',
    value: 'PY'
  },
  {
    label: 'Peru',
    officialName: 'The Republic of Peru',
    value: 'PE'
  },
  {
    label: 'Philippines',
    officialName: 'The Republic of the Philippines',
    value: 'PH'
  },
  {
    label: 'Poland',
    officialName: 'The Republic of Poland',
    value: 'PL'
  },
  {
    label: 'Portugal',
    officialName: 'The Portuguese Republic',
    value: 'PT'
  },
  {
    label: 'Qatar',
    officialName: 'The State of Qatar',
    value: 'QA'
  },
  {
    label: 'Romania',
    officialName: 'Romania',
    value: 'RO'
  },
  {
    label: 'Russia',
    officialName: 'The Russian Federation',
    value: 'RU'
  },
  {
    label: 'Rwanda',
    officialName: 'The Republic of Rwanda',
    value: 'RW'
  },
  {
    label: 'St Kitts and Nevis',
    officialName: 'The Federation of Saint Christopher and Nevis',
    value: 'KN'
  },
  {
    label: 'St Lucia',
    officialName: 'Saint Lucia',
    value: 'LC'
  },
  {
    label: 'St Vincent',
    officialName: 'Saint Vincent and the Grenadines',
    value: 'VC'
  },
  {
    label: 'Samoa',
    officialName: 'The Independent State of Samoa',
    value: 'WS'
  },
  {
    label: 'San Marino',
    officialName: 'The Republic of San Marino',
    value: 'SM'
  },
  {
    label: 'Sao Tome and Principe',
    officialName: 'The Democratic Republic of Sao Tome and Principe',
    value: 'ST'
  },
  {
    label: 'Saudi Arabia',
    officialName: 'The Kingdom of Saudi Arabia',
    value: 'SA'
  },
  {
    label: 'Senegal',
    officialName: 'The Republic of Senegal',
    value: 'SN'
  },
  {
    label: 'Serbia',
    officialName: 'The Republic of Serbia',
    value: 'RS'
  },
  {
    label: 'Seychelles',
    officialName: 'The Republic of Seychelles',
    value: 'SC'
  },
  {
    label: 'Sierra Leone',
    officialName: 'The Republic of Sierra Leone',
    value: 'SL'
  },
  {
    label: 'Singapore',
    officialName: 'The Republic of Singapore',
    value: 'SG'
  },
  {
    label: 'Slovakia',
    officialName: 'The Slovak Republic',
    value: 'SK'
  },
  {
    label: 'Slovenia',
    officialName: 'The Republic of Slovenia',
    value: 'SI'
  },
  {
    label: 'Solomon Islands',
    officialName: 'Solomon Islands',
    value: 'SB'
  },
  {
    label: 'Somalia',
    officialName: 'Federal Republic of Somalia',
    value: 'SO'
  },
  {
    label: 'South Africa',
    officialName: 'The Republic of South Africa',
    value: 'ZA'
  },
  {
    label: 'South Korea',
    officialName: 'The Republic of Korea',
    value: 'KR'
  },
  {
    label: 'South Sudan',
    officialName: 'The Republic of South Sudan',
    value: 'SS'
  },
  {
    label: 'Spain',
    officialName: 'The Kingdom of Spain',
    value: 'ES'
  },
  {
    label: 'Sri Lanka',
    officialName: 'The Democratic Socialist Republic of Sri Lanka',
    value: 'LK'
  },
  {
    label: 'Sudan',
    officialName: 'The Republic of the Sudan',
    value: 'SD'
  },
  {
    label: 'Suriname',
    officialName: 'The Republic of Suriname',
    value: 'SR'
  },
  {
    label: 'Sweden',
    officialName: 'The Kingdom of Sweden',
    value: 'SE'
  },
  {
    label: 'Switzerland',
    officialName: 'The Swiss Confederation',
    value: 'CH'
  },
  {
    label: 'Syria',
    officialName: 'The Syrian Arab Republic',
    value: 'SY'
  },
  {
    label: 'Tajikistan',
    officialName: 'The Republic of Tajikistan',
    value: 'TJ'
  },
  {
    label: 'Tanzania',
    officialName: 'The United Republic of Tanzania',
    value: 'TZ'
  },
  {
    label: 'Thailand',
    officialName: 'The Kingdom of Thailand',
    value: 'TH'
  },
  {
    label: 'The Bahamas',
    officialName: 'The Commonwealth of The Bahamas',
    value: 'BS'
  },
  {
    label: 'The Gambia',
    officialName: 'The Republic of The Gambia',
    value: 'GM'
  },
  {
    label: 'Togo',
    officialName: 'The Togolese Republic',
    value: 'TG'
  },
  {
    label: 'Tonga',
    officialName: 'The Kingdom of Tonga',
    value: 'TO'
  },
  {
    label: 'Trinidad and Tobago',
    officialName: 'The Republic of Trinidad and Tobago',
    value: 'TT'
  },
  {
    label: 'Tunisia',
    officialName: 'Republic of Tunisia',
    value: 'TN'
  },
  {
    label: 'Turkey',
    officialName: 'Republic of Türkiye',
    value: 'TR'
  },
  {
    label: 'Turkmenistan',
    officialName: 'Turkmenistan',
    value: 'TM'
  },
  {
    label: 'Tuvalu',
    officialName: 'Tuvalu',
    value: 'TV'
  },
  {
    label: 'Uganda',
    officialName: 'The Republic of Uganda',
    value: 'UG'
  },
  {
    label: 'Ukraine',
    officialName: 'Ukraine',
    value: 'UA'
  },
  {
    label: 'United Arab Emirates',
    officialName: 'The United Arab Emirates',
    value: 'AE'
  },
  {
    label: 'United States',
    officialName: 'The United States of America',
    value: 'US'
  },
  {
    label: 'Uruguay',
    officialName: 'The Oriental Republic of Uruguay',
    value: 'UY'
  },
  {
    label: 'Uzbekistan',
    officialName: 'The Republic of Uzbekistan',
    value: 'UZ'
  },
  {
    label: 'Vanuatu',
    officialName: 'The Republic of Vanuatu',
    value: 'VU'
  },
  {
    label: 'Vatican City',
    officialName: 'Vatican City State',
    value: 'VA'
  },
  {
    label: 'Venezuela',
    officialName: 'The Bolivarian Republic of Venezuela',
    value: 'VE'
  },
  {
    label: 'Vietnam',
    officialName: 'The Socialist Republic of Viet Nam',
    value: 'VN'
  },
  {
    label: 'Yemen',
    officialName: 'The Republic of Yemen',
    value: 'YE'
  },
  {
    label: 'Zambia',
    officialName: 'The Republic of Zambia',
    value: 'ZM'
  },
  {
    label: 'Zimbabwe',
    officialName: 'The Republic of Zimbabwe',
    value: 'ZW'
  }
];

module.exports = countriesList;
