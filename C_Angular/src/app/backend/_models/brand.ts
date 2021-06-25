export class Brand {
  isDeleting: boolean = false;

  constructor(
    public id: number,
    public name: string,
    public image: string,
    public description: string,
    public updated_at: string
  ) {}
}
