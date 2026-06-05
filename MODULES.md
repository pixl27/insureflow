# RÈGLE GÉNÉRALE POUR TOUS LES MODULES

Pour chaque module généré :

L'IA doit produire :

* Base de données
* Entités métier
* API REST
* Services métier
* Permissions RBAC
* Interfaces utilisateur
* Workflows
* Audit trail
* Logs
* Tests unitaires
* Tests E2E
* Documentation OpenAPI

Chaque module doit être indépendant et communiquer via événements métier.

Exemple :

ContractCreated
ClaimOpened
PaymentReceived
CommissionCalculated

Utiliser Event Sourcing lorsque pertinent.

---

# MODULE CRM

## Tables

Customer
Contact
Address
Company
Note
Task
Interaction
Attachment

## API

GET /customers

GET /customers/:id

POST /customers

PATCH /customers/:id

DELETE /customers/:id

## Écrans

Liste clients

Fiche client

Timeline

Documents

Historique

## Fonctionnalités

Fusion de doublons

Recherche intelligente

Scoring

Segmentation

---

# MODULE PRODUITS

## Tables

InsuranceProduct

Coverage

Exclusion

Deductible

PricingRule

CommissionRule

TaxRule

ProductVersion

## Builder No-Code

Interface drag and drop.

Permet de créer :

Garanties

Franchises

Conditions

Questionnaires

Tarification

## Workflow

Création

Validation

Publication

Archivage

---

# MODULE TARIFICATION

## Architecture

Rule Engine

Exécute des règles métier :

SI

Age > 25

ET

Ville = Paris

ALORS

Prime = Prime * 0.9

## Technologies

JSON Rules Engine

Decision Tables

Expression Builder

## Fonctionnalités

Simulation

Versionning

Tests des règles

Historique

---

# MODULE DEVIS

## Workflow

Création

↓

Questionnaire

↓

Calcul tarif

↓

Validation

↓

PDF

↓

Signature

↓

Conversion contrat

## Génération PDF

Template Engine

Variables dynamiques

Logo

Mentions légales

---

# MODULE CONTRATS

## Tables

Contract

ContractVersion

ContractEvent

Beneficiary

Guarantee

Premium

## Workflow

Souscription

↓

Validation

↓

Émission

↓

Actif

↓

Avenant

↓

Résiliation

## Écrans

Portefeuille

Contrat

Historique

Garanties

Documents

---

# MODULE SINISTRES

## Tables

Claim

ClaimEvent

ClaimReserve

ClaimPayment

ExpertMission

ClaimDocument

## Workflow

Déclaration

↓

Qualification

↓

Affectation

↓

Instruction

↓

Validation

↓

Paiement

↓

Clôture

## Fonctionnalités

Timeline

Photos

Pièces jointes

Commentaires

Expertise

Réserves

Paiements

## Détection Fraude

Score IA

Analyse comportementale

Règles métier

---

# MODULE GED

## Architecture

Object Storage

AWS S3

MinIO

Azure Blob

## Fonctionnalités

Versionning

OCR

Classement automatique

Recherche plein texte

Prévisualisation PDF

Signature électronique

## IA

Extraction :

Nom

Adresse

Date

Montant

Contrat

---

# MODULE COMPTABILITÉ

## Tables

Invoice

Payment

Transaction

AccountingEntry

Commission

Tax

## Workflow

Prime générée

↓

Facture créée

↓

Paiement reçu

↓

Écriture comptable

↓

Reversement commission

## Intégrations

Sage

SAP

Cegid

Oracle

---

# MODULE COMMISSIONS

## Calcul

Commission =
Prime × Taux

## Cas avancés

Commission par :

Produit

Courtier

Région

Volume

Objectifs

## Moteur

Rule Engine configurable

Sans code

---

# MODULE PAIEMENTS

## Providers

Stripe

GoCardless

MangoPay

PayPal

SEPA

## Workflow

Paiement initié

↓

Autorisation

↓

Capture

↓

Confirmation

↓

Écriture comptable

---

# MODULE PORTAIL ASSURÉ

## Écrans

Dashboard

Mes contrats

Mes documents

Mes paiements

Mes sinistres

Messagerie

## Fonctionnalités

Déclaration sinistre

Téléchargement documents

Paiement en ligne

Signature électronique

---

# MODULE COURTIER

## Écrans

Portefeuille

Production

Commissions

Devis

Sinistres

Reporting

## KPI

Prime émise

Contrats actifs

Taux transformation

Commission générée

---

# MODULE WORKFLOW ENGINE

## Builder

Drag and Drop

## Noeuds

Début

Condition

Validation

Email

SMS

Webhook

Fin

## Exemple

Sinistre > 5000€

↓

Validation manager

↓

Paiement

Sinon

↓

Paiement direct

---

# MODULE API

## Standards

REST

GraphQL

Webhooks

## Documentation

Swagger

OpenAPI

Postman Collection

## Sécurité

OAuth2

JWT

Rate Limiting

API Keys

---

# MODULE IA

## Assistant

Recherche naturelle

Résumé dossier

Génération emails

Aide décision

## OCR

Extraction documents

## Sinistres

Détection fraude

Scoring risque

## Contrats

Suggestions garanties

Upsell automatique

---

# STRUCTURE DE CODE ATTENDUE

/apps

frontend

backoffice

portail-assure

portail-courtier

/api

auth

crm

contracts

claims

billing

documents

payments

reporting

ai

/packages

ui

shared

database

events

/workflows

claims

contracts

billing

---

# LIVRABLE FINAL

Le code généré doit être directement déployable en production et atteindre un niveau fonctionnel équivalent aux principaux ERP assurance européens tout en conservant une interface moderne inspirée de Stripe, Linear, Notion et Vercel.
