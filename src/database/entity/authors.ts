import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { AuthorItemLink } from "./authorItem";

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  authorID: number;

  @Column()
  ORCID: string;

  @Column()
  name: string;

  // Define the inverse side of the relationship
  @OneToMany(() => AuthorItemLink, (authorItemLink) => authorItemLink.author)
  authorItemLinks: AuthorItemLink[];
}
