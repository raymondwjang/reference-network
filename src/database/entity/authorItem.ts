import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { Author } from "./authors";
import { Item } from "./Items";

@Entity("author-item-link")
export class AuthorItemLink {
  @PrimaryGeneratedColumn()
  creatorID: number;

  @PrimaryGeneratedColumn()
  itemID: number;

  @ManyToOne(() => Author, (author) => author.authorItemLinks)
  @JoinColumn({ name: "authorID" })
  author: Author;

  @ManyToOne(() => Item, (item) => item.authorItemLinks)
  @JoinColumn({ name: "itemID" })
  item: Item;
}
