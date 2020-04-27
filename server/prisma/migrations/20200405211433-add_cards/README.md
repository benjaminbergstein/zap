# Migration `20200405211433-add_cards`

This migration has been generated at 4/5/2020, 9:14:33 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Game" (
    "createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" integer  NOT NULL ,
    "id" SERIAL,
    "title" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."GameAttribute" (
    "gameId" integer  NOT NULL ,
    "id" SERIAL,
    "name" text  NOT NULL ,
    "value" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Player" (
    "id" SERIAL,
    "name" text   ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Card" (
    "gameId" integer  NOT NULL ,
    "id" SERIAL,
    "slug" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."CardAttribute" (
    "cardId" integer  NOT NULL ,
    "id" SERIAL,
    "name" text  NOT NULL ,
    "value" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."_gamePlayers" (
    "A" integer  NOT NULL ,
    "B" integer  NOT NULL 
) 

CREATE  INDEX "creatorId" ON "public"."Game"("creatorId")

CREATE UNIQUE INDEX "_gamePlayers_AB_unique" ON "public"."_gamePlayers"("A","B")

CREATE  INDEX "_gamePlayers_B_index" ON "public"."_gamePlayers"("B")

ALTER TABLE "public"."Game" ADD FOREIGN KEY ("creatorId")REFERENCES "public"."Player"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."GameAttribute" ADD FOREIGN KEY ("gameId")REFERENCES "public"."Game"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Card" ADD FOREIGN KEY ("gameId")REFERENCES "public"."Game"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."CardAttribute" ADD FOREIGN KEY ("cardId")REFERENCES "public"."Card"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_gamePlayers" ADD FOREIGN KEY ("A")REFERENCES "public"."Game"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_gamePlayers" ADD FOREIGN KEY ("B")REFERENCES "public"."Player"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200404113542-init..20200405211433-add_cards
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 generator client {
   provider = "prisma-client-js"
@@ -35,4 +35,20 @@
   name    String?
   games Game[] @relation(name: "gamePlayers", references: [id])
   createdGames Game[] @relation("gameCreators")
 }
+
+model Card {
+  id        Int      @default(autoincrement()) @id
+  gameId    Int
+  slug      String
+  game      Game @relation(fields: [gameId], references: [id])
+  cardAttributes CardAttribute[]
+}
+
+model CardAttribute {
+  id        Int      @default(autoincrement()) @id
+  cardId    Int
+  card      Card @relation(fields: [cardId], references: [id])
+  name      String
+  value     String
+}
```


