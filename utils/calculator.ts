export type Inputs = {
  totalTime: number; // total time in seconds
  cycleCount: number; // number of cycles
  bucketCapacity: number; // m³
  fillFactor: number; // percentage, e.g., 51.77
  materialDensity: number; // kg/m³
  fuelConsumption: number; // l/h
  dieselPrice: number; // R$/l
  truckCapacity: number; // m³
  physicalAvailability: number; // percentage, e.g., 77
  workingDaysPerMonth: number; // days available
  workingHoursPerDay: number; // hours per day
};

export type Outputs = {
  effectiveVolume: number;
  effectiveMass: number;
  loadedVolume: number;
  loadedMass: number;
  tripsPerHour: number;
  volumePerHour: number;
  weightPerHour: number;
  efficiency: number;
  costPerHour: number;
  costPerDay: number;
  costPerMonth: number;
  costPerM3: number;
  costPerTonPerHour: number;
};

export function calcularSaidas(input: Inputs): Outputs {
  const fillFactor = input.fillFactor / 100;
  const physicalAvailability = input.physicalAvailability / 100;

  // Effective Volume = Bucket Capacity x Fill Factor
  const effectiveVolume = input.bucketCapacity * fillFactor;

  // Effective Mass = Effective Volume x Material Density
  const effectiveMass = effectiveVolume * input.materialDensity;

  // Loaded Volume = Effective Volume x Cycle Count
  const loadedVolume = effectiveVolume * input.cycleCount;

  // Loaded Mass = Effective Mass x Cycle Count
  const loadedMass = effectiveMass * input.cycleCount;

  // Trips per Hour = (3600 * Physical Availability) / Total Time
  const tripsPerHour = (3600 * physicalAvailability) / input.totalTime;

  // Volume per Hour = Trips per Hour x Loaded Volume
  const volumePerHour = tripsPerHour * loadedVolume;

  // Weight per Hour = Volume per Hour x Density (in tons)
  const weightPerHour = (volumePerHour * input.materialDensity) / 1000;

  // Efficiency = Weight per Hour / Fuel Consumption (tons/liter)
  const efficiency = weightPerHour / input.fuelConsumption;

  // Cost per Hour = Fuel Consumption x Diesel Price
  const costPerHour = input.fuelConsumption * input.dieselPrice;

  // Cost per Day = Cost per Hour x Working Hours per Day
  const costPerDay = costPerHour * input.workingHoursPerDay;

  // Cost per Month = Cost per Day x Working Days per Month
  const costPerMonth = costPerDay * input.workingDaysPerMonth;

  // Cost per m³ = Cost per Hour / Volume per Hour
  const costPerM3 = costPerHour / volumePerHour;

  // Cost per Ton per Hour = Cost per Hour / Weight per Hour
  const costPerTonPerHour = costPerHour / weightPerHour;

  return {
    effectiveVolume,
    effectiveMass,
    loadedVolume,
    loadedMass,
    tripsPerHour,
    volumePerHour,
    weightPerHour,
    efficiency,
    costPerHour,
    costPerDay,
    costPerMonth,
    costPerM3,
    costPerTonPerHour,
  };
}
