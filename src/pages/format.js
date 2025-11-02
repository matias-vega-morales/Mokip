/**
 * Formatea un número como moneda chilena (CLP).
 * @param {number} amount - La cantidad a formatear.
 * @returns {string} - El valor formateado, ej: "$10.000".
 */
export function formatPriceCLP(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0';
  }
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
}