import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { AuthorItemLink } from "./authorItem";

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  itemID: number;

  @Column()
  updated_datetime: Date;

  @OneToMany(() => AuthorItemLink, (authorItemLink) => authorItemLink.item)
  authorItemLinks: AuthorItemLink[];
}
