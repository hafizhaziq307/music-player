// check if value is empty or not
export const isEmpty = (val: any) => {
  if (val === null) return true;

  if (typeof val === "string") {
    return val.trim() === "";
  }
};