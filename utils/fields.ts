export const inputFields = [
  'totalTime', // total time in seconds
  'cycleCount', // number of cycles
  'bucketCapacity', // m³
  'materialDensity', // kg/m³
  'fillFactor', // percentage, e.g., 51.77
  'fuelConsumption', // l/h
  'dieselPrice', // R$/l
  // 'truckCapacity', // m³
  'physicalAvailability', // percentage, e.g., 77
  'workingDaysPerMonth', // days available
  'workingHoursPerDay', // hours per day
];

export const densityOptions = [
  { key: 'wood_chips_pulp', valor: 288 },
  { key: 'ash_coal_slag', valor: 673 },
  { key: 'clay_gravel_dry', valor: 1602 },
  { key: 'clay_compact_solid', valor: 1746 },
  { key: 'clay_dry_loose', valor: 1009 },
  { key: 'clay_excavated_water', valor: 1282 },
  { key: 'coal_anthracite_loose', valor: 865 },
  { key: 'coal_bituminous_wet', valor: 801 },
  { key: 'earth_common_clay_dry', valor: 1218 },
  { key: 'earth_mud_compacted', valor: 1843 },
  { key: 'granite_crushed', valor: 1538 },
  { key: 'gypsum', valor: 2275 },
  { key: 'limestone_coarse', valor: 1570 },
  { key: 'limestone_mixed', valor: 1682 },
  { key: 'limestone_pulverized', valor: 1362 },
  { key: 'sand_wet', valor: 2083 },
  { key: 'sand_dry', valor: 1762 },
  { key: 'sand_water_filled', valor: 2083 },
  { key: 'sandstone_quarried', valor: 1314 },
  { key: 'shale_crushed', valor: 1362 },
  { key: 'slag_granulated', valor: 1955 },
  { key: 'gravel_large', valor: 1442 },
  { key: 'gravel_small', valor: 1602 },
];

// const opcoesDensidade = [
//   { nome: 'Lascas, madeira para celulose', valor: 288 },
//   { nome: 'Cinzas (carvão, cinzas, escória de carvão)', valor: 673 },
//   { nome: 'Argila e cascalho, secos', valor: 1602 },
//   { nome: 'Argila, compacta, sólida', valor: 1746 },
//   { nome: 'Argila, seca, em pedaços soltos', valor: 1009 },
//   { nome: 'Argila, escavada na água', valor: 1282 },
//   { nome: 'Carvão, antracite, quebrado, solto', valor: 865 },
//   { nome: 'Carvão, betuminoso, moderadamente úmido', valor: 801 },
//   { nome: 'Terra, argila comum, seca', valor: 1218 },
//   { nome: 'Terra, lama, compactada', valor: 1843 },
//   { nome: 'Granito, quebrado', valor: 1538 },
//   { nome: 'Gesso', valor: 2275 },
//   { nome: 'Calcário, grosso, granulado', valor: 1570 },
//   { nome: 'Calcário, vários tamanhos', valor: 1682 },
//   { nome: 'Calcário, pulverizado ou triturado', valor: 1362 },
//   { nome: 'Areia, úmida', valor: 2083 },
//   { nome: 'Areia, seca', valor: 1762 },
//   { nome: 'Areia, espaços vazios, cheios de água', valor: 2083 },
//   { nome: 'Arenito, extraído', valor: 1314 },
//   { nome: 'Xisto, triturado, quebrado', valor: 1362 },
//   { nome: 'Escória, de forno, granulada', valor: 1955 },
//   { nome: 'Pedra ou cascalho (37,5 a 87,5 mm)', valor: 1442 },
//   { nome: 'Pedra ou cascalho (18,75 mm)', valor: 1602 },
// ];

// Descrições
// const descricoes: Record<keyof Outputs, string> = {
//   effectiveVolume:
//     'Capacidade x FatorEnchimento\n\nMédia de volume que o operador consegue encher na escavadeira.',
//   effectiveMass: 'VolumeEfetivo x Densidade\n\nKg por ciclo.',
//   loadedVolume: 'VolumeEfetivo x Ciclo\n\nVolume por caminhão.',
//   loadedMass: 'MassaEfetiva x Ciclo\n\nMassa por caminhão.',
//   tripsPerHour: '(3600 * DF) / TempoCarregamento\n\nQuantidade de viagens por hora.',
//   volumePerHour: 'ViagemHora x VolumeCarregado\n\nVolume carregado por hora.',
//   weightPerHour: 'ViagemHora x MassaCarregada\n\nPeso carregado por hora.',
//   efficiency: 'PesoHora / ConsumoCombustivel\n\nToneladas movimentadas por litro de combustível.',
//   costPerHour:
//     'PreçoDiesel x ConsumoCombustivel\n\nValor gasto com combustivel por hora de operação.',
//   costPerDay:
//     '(PreçoDiesel x ConsumoCombustivel) x Dia\n\nValor gasto com combustivel por dia de operação.',
//   costPerMonth:
//     '(ValorDiesel x ConsumoCombustivel) x (Dia x DiasMês)\n\nValor gasto com combustivel por mês de produção.',
//   costPerM3: 'CustoHora / VolumeHora\n\nValor gasto com combustivel por metro cúbico.',
//   costPerTonPerHour:
//     'CustoHora / PesoHora\n\nValor gasto com combustível por tonelada hora.',
// };

// // Unidades
// const unidades: Record<keyof Outputs, string> = {
//   effectiveVolume: 'm³',
//   effectiveMass: 'kg',
//   loadedVolume: 'm³',
//   loadedMass: 'kg',
//   tripsPerHour: 'viagens/h',
//   volumePerHour: 'm³/h',
//   weightPerHour: 'ton/h',
//   efficiency: 'ton/L',
//   costPerHour: 'R$/h',
//   costPerDay: 'R$/dia',
//   costPerMonth: 'R$/mês',
//   costPerM3: 'R$/m³',
//   costPerTonPerHour: 'R$/(ton/h)',
// };
