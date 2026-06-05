# INSTRUCTIONS.MD

## Projet

Développer une plateforme SaaS moderne de gestion d'assurance inspirée des fonctionnalités métier d'Okayo, mais avec une architecture cloud-native, une UX moderne et une expérience utilisateur comparable aux meilleurs SaaS actuels.

Nom de code : INSUREFLOW

---

# Vision Produit

Construire le système d'exploitation complet d'une compagnie d'assurance, mutuelle, MGA, courtier grossiste ou délégataire.

Le système doit permettre :

* Gestion des contrats
* Gestion des sinistres
* Gestion financière
* Gestion documentaire
* CRM
* Workflows métier
* Portails partenaires
* APIs
* Reporting
* Paramétrage métier sans code

L'objectif est de reproduire et dépasser ses capacités fonctionnelles avec une expérience utilisateur moderne.

---

# Stack Technique

## Frontend

* Next.js 15
* React 19
* TypeScript
* TailwindCSS
* Shadcn/UI
* Tanstack Query
* Zustand
* React Hook Form
* Zod
* Framer Motion

## Backend

* NestJS
* TypeScript
* PostgreSQL
* Redis
* Prisma ORM
* BullMQ
* OpenAPI

## Infrastructure

* Docker
* Kubernetes
* AWS
* Terraform

## Authentification

* Keycloak
* JWT
* OAuth2
* SSO

---

# Design System

Style :

* Linear
* Stripe
* Vercel
* Notion
* Ramp

Couleurs :

* Fond blanc cassé
* Bleu assurance premium
* Accent turquoise
* Gris neutres

Principes :

* très peu de modales
* navigation rapide
* tout accessible en moins de 3 clics
* recherche globale omniprésente

---

# Architecture Fonctionnelle

## MODULE 1 : CRM CENTRAL

Gestion complète des personnes :

### Personnes

* particuliers
* entreprises
* associations

### Données

* identité
* coordonnées
* adresses
* emails
* téléphones
* RIB
* KYC
* historique

### Fonctionnalités

* timeline
* interactions
* tâches
* notes
* pièces jointes

---

# MODULE 2 : PRODUITS D'ASSURANCE

Moteur no-code

Créer :

* Auto
* Moto
* Habitation
* Santé
* Prévoyance
* RC Pro
* MRP
* Affinitaire
* Animaux

Paramétrage :

* garanties
* franchises
* exclusions
* plafonds
* tarifs
* commissions
* taxes

Versionning complet.

---

# MODULE 3 : DEVIS

Création :

* devis rapide
* devis expert

Fonctionnalités :

* calcul temps réel
* scoring
* génération PDF
* signature électronique

---

# MODULE 4 : CONTRATS

Cycle de vie complet

### Création

* souscription
* validation
* émission

### Gestion

* avenants
* résiliation
* suspension
* renouvellement

### Historique

* audit complet
* traçabilité

---

# MODULE 5 : SINISTRES

Gestion bout-en-bout

### Ouverture

* portail
* email
* API
* opérateur

### Workflow

* qualification
* expertise
* validation
* règlement

### Fonctionnalités

* timeline
* documents
* photos
* missions experts
* paiements
* réserves

---

# MODULE 6 : GED

Gestion électronique documentaire

Types :

* contrats
* avenants
* sinistres
* justificatifs

Fonctionnalités :

* OCR
* IA extraction
* versioning
* archivage
* signatures

---

# MODULE 7 : WORKFLOW ENGINE

Moteur BPMN

Permet :

* validation
* approbation
* contrôle
* relance

Builder drag-and-drop.

---

# MODULE 8 : COMPTABILITÉ TECHNIQUE

Gestion :

* primes
* taxes
* commissions
* reversements

Fonctions :

* quittancement
* échéanciers
* encaissements

---

# MODULE 9 : COMPTABILITÉ GÉNÉRALE

Export :

* Sage
* SAP
* Cegid

Fonctionnalités :

* écritures
* rapprochements
* audits

---

# MODULE 10 : COMMISSIONNEMENT

Calcul dynamique :

* apporteur
* distributeur
* produit
* risque

Moteur de règles :

IF / ELSE

Sans développement.

---

# MODULE 11 : PAIEMENTS

Support :

* SEPA
* CB
* Stripe
* GoCardless

Fonctions :

* prélèvements
* remboursements
* rejets

---

# MODULE 12 : PORTAIL ASSURÉ

Fonctionnalités :

* consulter contrats
* déclarer sinistre
* télécharger documents
* payer cotisations
* messagerie

Responsive mobile.

---

# MODULE 13 : PORTAIL COURTIER

Fonctionnalités :

* portefeuille
* devis
* souscription
* suivi commissions
* reporting

---

# MODULE 14 : PORTAIL PARTENAIRES

Accès cloisonné.

Acteurs :

* experts
* gestionnaires
* compagnies
* apporteurs

---

# MODULE 15 : MOTEUR DOCUMENTAIRE

Templates :

* Word
* PDF
* HTML

Variables dynamiques.

Génération :

* contrat
* quittance
* courrier
* relance

---

# MODULE 16 : MESSAGERIE

Canaux :

* Email
* SMS
* WhatsApp
* Notifications

Automatisation.

---

# MODULE 17 : RECHERCHE UNIFIÉE

Recherche type Google :

* contrats
* clients
* sinistres
* documents

Résultats instantanés.

---

# MODULE 18 : REPORTING

Dashboards :

* production
* sinistres
* rentabilité
* commissions
* comptabilité

Exports :

* PDF
* Excel
* CSV

---

# MODULE 19 : BUSINESS INTELLIGENCE

Datamart intégré.

KPIs :

* loss ratio
* combined ratio
* S/P
* fréquence
* gravité

---

# MODULE 20 : API PLATFORM

REST API complète.

Fonctionnalités :

* auth
* webhooks
* versioning

Documentation Swagger.

---

# MODULE 21 : ADMINISTRATION

Gestion :

* utilisateurs
* rôles
* permissions
* groupes

RBAC complet.

---

# MODULE 22 : MULTI-ENTITÉS

Support :

* multi-compagnies
* multi-filiales
* multi-courtiers

Isolation stricte.

---

# MODULE 23 : AUDIT

Historisation :

* création
* modification
* suppression

Immuable.

---

# MODULE 24 : IA

Assistant IA intégré.

Fonctions :

* résumé dossier
* détection fraude
* extraction documents
* aide décision

LLM compatible.

---

# UX OBLIGATOIRE

Chaque écran doit contenir :

* recherche
* filtres
* favoris
* actions rapides

---

# Dashboard Principal

Widgets :

* contrats actifs
* primes émises
* sinistres ouverts
* paiements
* tâches urgentes

---

# Performance

Objectifs :

* TTFB < 200ms
* recherche < 100ms
* dashboard < 1s

---

# Sécurité

* RGPD
* chiffrement AES-256
* MFA
* audit trail
* journalisation

---

# Livrables

Générer :

1. Architecture complète
2. Schéma base de données
3. API OpenAPI
4. Frontend complet
5. Backoffice
6. Portails
7. Infrastructure Docker
8. Terraform AWS
9. Tests
10. Documentation

Objectif final :

Créer la plateforme d'assurance la plus moderne du marché européen, inspirée fonctionnellement des grands back-offices assurance historiques mais avec une expérience utilisateur de niveau Stripe, Linear et Notion.
