export type CostItem = {
  id: string;
  label: string;
  amount: number;
};

export const initialSaleCosts: CostItem[] = [
  { id: "compra", label: "Compra", amount: 0 },
  { id: "placas", label: "Placas", amount: 0 },
  { id: "llantas", label: "Llantas", amount: 0 },
  { id: "pintura", label: "Pintura", amount: 0 },
  { id: "bateria", label: "Batería", amount: 0 },
  { id: "uretano", label: "Uretano", amount: 0 },
  { id: "tapiceria", label: "Tapicería", amount: 0 },
  { id: "trabajada", label: "Trabajada", amount: 0 },
  { id: "clima", label: "Clima A/C", amount: 0 },
  { id: "parabrisas", label: "Parabrisas", amount: 0 },
  { id: "hojalateria", label: "Hojalatería", amount: 0 },
  { id: "repuve", label: "Repuve MX", amount: 0 },
  { id: "calcomanias", label: "Calcomanías", amount: 0 },
  { id: "accesorios", label: "Accesorios o partes", amount: 0 },
  { id: "busqueda de datos", label: "Busqueda de datos", amount: 0 },
  { id: "otros" ,label: "Otros", amount: 0 },
];

export const initialOperatingCosts: CostItem[] = [
  { id: "hotel", label: "Hotel", amount: 0 },
  { id: "lavada", label: "Lavada", amount: 0 },
  { id: "vuelos", label: "Vuelos", amount: 0 },
  { id: "casetas", label: "Casetas", amount: 0 },
  { id: "comidas", label: "Comidas", amount: 0 },
  { id: "gasolina", label: "Gasolina", amount: 0 },
  { id: "transporte", label: "Transporte", amount: 0 },
  { id: "chofer", label: "Chofer traslado", amount: 0 },
  { id: "paqueteria", label: "Envíos Paquetería", amount: 0 },
  { id: "comision-venta", label: "Comisión por venta", amount: 0 },
  { id: "comision-compra", label: "Comisión por compra", amount: 0 },
  { id: "otros", label: "Otros", amount: 0 },
];