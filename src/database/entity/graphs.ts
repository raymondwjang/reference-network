import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Graph {
  @PrimaryGeneratedColumn()
  graphID: number;

  @Column()
  source: string;

  @Column()
  type: string;

  @Column()
  target: string;

  @Column()
  data_source: string;
}
