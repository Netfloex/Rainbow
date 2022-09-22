import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class HashedWord {
	@PrimaryColumn({ unique: true })
	index!: number

	@Column({ unique: true })
	md5!: string
}
