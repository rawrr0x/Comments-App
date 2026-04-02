import { BaseEntity } from '../../common/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Comment } from '../comments/comments.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  name: string;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @Column()
  password: string;
}
