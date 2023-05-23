export interface Body {
  name: string
  email: string
  phone: string
}

export interface BodyUpdate extends Partial<Body> {
  favorite?: boolean
}
