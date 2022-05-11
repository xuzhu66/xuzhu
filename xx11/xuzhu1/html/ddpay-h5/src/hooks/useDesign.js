import { isNumber } from 'lodash'
export function pxToViewport(value) {
  if (isNumber(value)) {
    return (value / 3.75).toFixed(3)
  } else {
    return 0
  }
}
