- gitlab runner which trigger gcp cloud build job
- runner is triggered on push
- relies on `GCP_PROJECT_ID_STAGING/PROD` and `GCP_CI_SA_PK_STAGING/PROD` gitlab env vars and on respective service accounts in gcp