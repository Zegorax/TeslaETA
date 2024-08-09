"""Multi Car Support

Revision ID: aae5eeb8d2bc
Revises: 
Create Date: 2024-08-05 22:51:19.163085

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'aae5eeb8d2bc'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('share', schema=None) as batch_op:
        batch_op.add_column(sa.Column('carid', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('share', schema=None) as batch_op:
        batch_op.drop_column('carid')

    # ### end Alembic commands ###
