-- CreateTable
CREATE TABLE "GoalLabel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoalLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GoalToGoalLabel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GoalToGoalLabel_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoalLabel_name_key" ON "GoalLabel"("name");

-- CreateIndex
CREATE INDEX "_GoalToGoalLabel_B_index" ON "_GoalToGoalLabel"("B");

-- AddForeignKey
ALTER TABLE "_GoalToGoalLabel" ADD CONSTRAINT "_GoalToGoalLabel_A_fkey" FOREIGN KEY ("A") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GoalToGoalLabel" ADD CONSTRAINT "_GoalToGoalLabel_B_fkey" FOREIGN KEY ("B") REFERENCES "GoalLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
