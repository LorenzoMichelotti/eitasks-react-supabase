export default interface Response<T> {
  model?: T;
  errors: string[];
  success: boolean;
}
