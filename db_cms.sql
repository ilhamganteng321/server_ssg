/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.7.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: db_cms
-- ------------------------------------------------------
-- Server version	11.7.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `m_user_t`
--

DROP TABLE IF EXISTS `m_user_t`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_user_t` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `role` varchar(2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `m_user_t_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_user_t`
--

LOCK TABLES `m_user_t` WRITE;
/*!40000 ALTER TABLE `m_user_t` DISABLE KEYS */;
INSERT INTO `m_user_t` VALUES
(6,13,'0a'),
(7,14,'0a'),
(8,15,'0a'),
(9,16,'0a'),
(10,1,'0a'),
(13,4,'0a'),
(14,3,'1a');
/*!40000 ALTER TABLE `m_user_t` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presensi`
--

DROP TABLE IF EXISTS `presensi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `presensi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `qrcode_text` varchar(20) NOT NULL,
  `jenis` enum('masuk','keluar') NOT NULL,
  `waktu_presensi` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `presensi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presensi`
--

LOCK TABLES `presensi` WRITE;
/*!40000 ALTER TABLE `presensi` DISABLE KEYS */;
INSERT INTO `presensi` VALUES
(6,3,'B510001','masuk','2025-04-20 16:36:18'),
(7,3,'B510001','keluar','2025-04-20 16:40:13');
/*!40000 ALTER TABLE `presensi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_education`
--

DROP TABLE IF EXISTS `user_education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_education` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `pendidikan_terakhir` varchar(100) NOT NULL,
  `pekerjaan` varchar(100) DEFAULT NULL,
  `organisasi` varchar(255) DEFAULT NULL,
  `motivasi` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user` (`user_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_education`
--

LOCK TABLES `user_education` WRITE;
/*!40000 ALTER TABLE `user_education` DISABLE KEYS */;
INSERT INTO `user_education` VALUES
(1,14,'S2','Software Developer','Himpunan Mahasiswa Informatika','Ingin mengembangkan karir di bidang teknologi'),
(2,13,'S3','Software Developer','Himpunan Mahasiswa Informatika','Ingin mengembangkan karir di bidang teknologi'),
(4,4,'D3','Mengurus rumah tangga','sayang heulang','garut');
/*!40000 ALTER TABLE `user_education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_files`
--

DROP TABLE IF EXISTS `user_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_type` enum('ktp','pas_foto','surat_izin','surat_kesehatan','bukti_pembayaran') NOT NULL,
  `google_drive_file_id` varchar(100) NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_files_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_files`
--

LOCK TABLES `user_files` WRITE;
/*!40000 ALTER TABLE `user_files` DISABLE KEYS */;
INSERT INTO `user_files` VALUES
(6,1,'44330822.png','ktp','1bPUVp9NgPLfe8DJISlsdnwci_OAAWvEf','2025-04-15 07:19:54'),
(7,1,'images (2).jpeg','pas_foto','1MBGpIXHmkWzcOYbHQKQFrTYSEXCp4APi','2025-04-15 07:19:57'),
(8,1,'api-key.json','surat_izin','1wEiVe9lsRPlCIV7RIq6gWp5nn_sI55qK','2025-04-15 07:19:59'),
(9,1,'server.zip','surat_kesehatan','1jK4RdeZ9rFxpTVn6fxzyI5lD8XxSWSS3','2025-04-15 07:20:01'),
(10,1,'example.txt','bukti_pembayaran','1PASqGuBM4bTeo178PDBGrRpdyMTXDoOZ','2025-04-15 07:20:03'),
(11,4,'44330822.png','ktp','101IidPM06Ix4nGAGihmIh1q3I-2PSDiq','2025-04-16 01:25:33'),
(12,4,'images (2).jpeg','pas_foto','175fHIW4jPxXHSBRt5axJ2PXi_rR06tkC','2025-04-16 01:25:35'),
(13,4,'api-key.json','surat_izin','1gn0L6ZH4RmIfCER0Nu_sGIuJ3AIRJgrh','2025-04-16 01:25:36'),
(14,4,'server.zip','surat_kesehatan','1lXTIBAJ-YAg5OMAX-TUwM3J90LMb4FOz','2025-04-16 01:25:39'),
(15,4,'example.txt','bukti_pembayaran','140RG3ZOqU11eKc2Fa65ujWjlaUbjur3Z','2025-04-16 01:25:41'),
(16,3,'44330822.png','ktp','1zSkRoFSHaOr4u2nJLpdZsRh97wilTlMN','2025-04-16 01:27:26'),
(17,3,'images (2).jpeg','pas_foto','1QJ1Io1Un2N9agPTbL1sHjBe7RgG4-Mx1','2025-04-16 01:27:30'),
(18,3,'api-key.json','surat_izin','1csOe4CWc_C5qghJkaQjGOR8qEnPOgbzy','2025-04-16 01:27:32'),
(19,3,'server.zip','surat_kesehatan','1WaldWCd6k-A6OQERULr4CvI33n5GEIt7','2025-04-16 01:27:34'),
(20,3,'example.txt','bukti_pembayaran','10lV76Awa945jelxPb4ecmpoeVVMGamLO','2025-04-16 01:27:36'),
(21,2,'44330822.png','ktp','1r5c1bSwgsFUuSgRH2zsx-XvksdYGZoRG','2025-04-16 02:02:28'),
(22,2,'images (2).jpeg','pas_foto','1DYSiGkPpgpyJ_N38fk1PXh36xdLnaFqK','2025-04-16 02:02:50'),
(23,2,'api-key.json','surat_izin','1AJS3UPetez9dDK9R7AxkSllPh8zA4Rgj','2025-04-16 02:02:51'),
(24,2,'server.zip','surat_kesehatan','1mjuaXfnXoCO-EURXxkFzHR4gj8miC5h4','2025-04-16 02:02:53'),
(25,2,'example.txt','bukti_pembayaran','1V_Sk4J82wPp2F6WbLnCoOojwuiEPo-vu','2025-04-16 02:02:56'),
(26,4,'empty.txt','ktp','1eSqzpktl5jiDzLy_kn-kJEzh2gYRQnYF','2025-04-16 02:05:43'),
(27,4,'empty.txt','pas_foto','1ylSW5OKnMUsSdKsq3kFi1Wf5LKtV-akv','2025-04-16 02:05:44'),
(28,4,'empty.txt','surat_izin','1m-eB5ZFeTcM4l4V0bbzzlJ5DohRNxjWx','2025-04-16 02:05:46'),
(29,4,'empty.txt','surat_kesehatan','1mw8S9a4oGLwVUXDwKA9axiNqS97JtUan','2025-04-16 02:05:48'),
(30,4,'empty.txt','bukti_pembayaran','1wh3Zc7xwP25lErEcj3T68XyZKCRBxBKg','2025-04-16 02:05:50'),
(31,4,'empty.txt','ktp','1uiseDNHuY_FsmmmV2eKK8rg1IsrzE10_','2025-04-16 02:26:34'),
(32,4,'empty.txt','pas_foto','1HSuO-VKyt0IiXKh4dxGRdwZYtkVFko4Q','2025-04-16 02:26:36'),
(33,4,'empty.txt','surat_izin','1fw7unHFhSICMuRUA1FrQWithK8JSIU9l','2025-04-16 02:26:38'),
(34,4,'empty.txt','surat_kesehatan','1e1t0iMlHyfhVri8gHQCJw-4VbZu5Iv-u','2025-04-16 02:26:40'),
(35,4,'empty.txt','bukti_pembayaran','11HMaafQyf8woUEU0EEaySaplD63UjS4V','2025-04-16 02:26:41'),
(36,4,'empty.txt','ktp','1AC0c2ulp1RtgZ0RclAC4tU13OgVcZNwg','2025-04-16 02:56:07'),
(37,4,'empty.txt','pas_foto','1xBkc33XccQK0fuKgNCCE1FrHRYCrNK6K','2025-04-16 02:56:09'),
(38,4,'empty.txt','surat_izin','1N8K_hgzJl_ySwJhRyblfoI8ihB765e3a','2025-04-16 02:56:11'),
(39,4,'empty.txt','surat_kesehatan','1CAm-E8-33j-A3F862GHZ6HkikPT35QzX','2025-04-16 02:56:13'),
(40,4,'empty.txt','bukti_pembayaran','19TDIysd4UmMX6Im_BIdZZPHtYl85DatP','2025-04-16 02:56:15'),
(41,4,'44330822.png','ktp','10jCKe9baz2m8PYOeVmW-RDv2bBqwCjSP','2025-04-16 09:22:10'),
(42,4,'images (2).jpeg','pas_foto','1VU31IbW3OWaWFzSHRA4s_-vUTvTi0zKG','2025-04-16 09:22:12'),
(43,4,'44330822.png','surat_izin','1r6LEh4iOgK5sB4kJt0_GohcTLq-R6yoX','2025-04-16 09:22:15'),
(44,4,'logo.png','surat_kesehatan','1h3ypeXAqYibUcTGXAjvfyUaN-IFTQZGU','2025-04-16 09:22:19'),
(45,4,'avatar.png','bukti_pembayaran','1UK-o5PbqIXDRsX38jJPgcWO3LdWVUd9a','2025-04-16 09:22:22'),
(46,4,'44330822.png','ktp','1ncjyX18V1pqd3PmOPC89sMNs7dVwtzSY','2025-04-17 00:41:45'),
(47,4,'images (2).jpeg','pas_foto','1kX4coQzwiuk2cBfEMtJHQkYB8OGW_1kW','2025-04-17 00:41:47'),
(48,4,'api-key.json','surat_izin','18Y9X_8yX_SzWyKWarZF4vwSETu0x1fs2','2025-04-17 00:41:50'),
(49,4,'server.zip','surat_kesehatan','1-VOf2ZNmL-8zKEn77HhejK0CDuaVE1GI','2025-04-17 00:41:53'),
(50,4,'example.txt','bukti_pembayaran','1xBlk1AEwwnyfEmzOnMdblVHvRrCQD3tq','2025-04-17 00:41:55');
/*!40000 ALTER TABLE `user_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_health`
--

DROP TABLE IF EXISTS `user_health`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_health` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `riwayat_penyakit` text DEFAULT NULL,
  `memiliki_disabilitas` enum('ya','tidak') NOT NULL DEFAULT 'tidak',
  `kontak_darurat_nama` varchar(100) DEFAULT NULL,
  `kontak_darurat_nomor` varchar(20) DEFAULT NULL,
  `hubungan_darurat` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_user_health` (`user_id`),
  CONSTRAINT `fk_user_health_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_health`
--

LOCK TABLES `user_health` WRITE;
/*!40000 ALTER TABLE `user_health` DISABLE KEYS */;
INSERT INTO `user_health` VALUES
(3,1,'Hipertensi','ya','Budi Santoso','08123456789','Orang tua'),
(4,4,'tidak ada','tidak','igunana','0881023504625','Orang tua');
/*!40000 ALTER TABLE `user_health` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_otps`
--

DROP TABLE IF EXISTS `user_otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_otps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `otp_code` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_otps_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_otps`
--

LOCK TABLES `user_otps` WRITE;
/*!40000 ALTER TABLE `user_otps` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_qrcodes`
--

DROP TABLE IF EXISTS `user_qrcodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_qrcodes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `qrcode_text` varchar(100) DEFAULT NULL,
  `qrcode_image` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_qrcodes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_qrcodes`
--

LOCK TABLES `user_qrcodes` WRITE;
/*!40000 ALTER TABLE `user_qrcodes` DISABLE KEYS */;
INSERT INTO `user_qrcodes` VALUES
(5,3,'B510001','data:image/png;base64,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','2025-04-18 06:44:40');
/*!40000 ALTER TABLE `user_qrcodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_re_registration`
--

DROP TABLE IF EXISTS `user_re_registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_re_registration` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `flag` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_re_registration_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_re_registration`
--

LOCK TABLES `user_re_registration` WRITE;
/*!40000 ALTER TABLE `user_re_registration` DISABLE KEYS */;
INSERT INTO `user_re_registration` VALUES
(1,3,'1'),
(2,2,'1');
/*!40000 ALTER TABLE `user_re_registration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_verify`
--

DROP TABLE IF EXISTS `user_verify`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_verify` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `isverified` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_verify_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_verify`
--

LOCK TABLES `user_verify` WRITE;
/*!40000 ALTER TABLE `user_verify` DISABLE KEYS */;
INSERT INTO `user_verify` VALUES
(7,13,1),
(8,14,0),
(9,15,0),
(10,16,1),
(11,1,1),
(12,2,0),
(13,3,0),
(14,4,1);
/*!40000 ALTER TABLE `user_verify` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_lengkap` varchar(255) NOT NULL,
  `nik` varchar(255) NOT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `tempat_lahir` varchar(255) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `rt` varchar(5) DEFAULT NULL,
  `rw` varchar(5) DEFAULT NULL,
  `kode_pos` varchar(10) DEFAULT NULL,
  `kelurahan_desa` varchar(100) DEFAULT NULL,
  `kecamatan` varchar(100) DEFAULT NULL,
  `kabupaten_kota` varchar(100) DEFAULT NULL,
  `provinsi` varchar(100) DEFAULT NULL,
  `domisili_kode_pos` varchar(10) DEFAULT NULL,
  `domisili_kelurahan_desa` varchar(100) DEFAULT NULL,
  `domisili_kecamatan` varchar(100) DEFAULT NULL,
  `domisili_kabupaten_kota` varchar(100) DEFAULT NULL,
  `domisili_provinsi` varchar(100) DEFAULT NULL,
  `nomor_hp` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `golongan_darah` enum('A','B','AB','O','-') DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `domisili_rt` varchar(5) DEFAULT NULL,
  `domisili_rw` varchar(5) DEFAULT NULL,
  `domisili_alamat` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nik` (`nik`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'{\"encrypted\":\"49e886a59cf4397cfbf09b61daa6d1b29eb7e3\",\"iv\":\"144a77495032a06b5e704624\",\"authTag\":\"9fa9d3b06abe09372c15f79551a22117\"}','{\"encrypted\":\"640213586c729078ad59ab206cf0189f\",\"iv\":\"9cfec72395d0a50accf04895\",\"authTag\":\"ee33ef93a6275c810757d753ae5f00e0\"}','L','gerut','1995-08-17','{\"encrypted\":\"6c0a8da81af2f83086a82220cd77682a7744\",\"iv\":\"e1fd00ec21593ccd048f1f71\",\"authTag\":\"d22c6339570f2638c4aed450ac298e2e\"}','01','02','40123','Cihampelas','Cimahi Utara','Kota Cimahi','Jawa Barat','40234','Sukagalih','Sukajadi','Kota Bandung','Jawa Barat','{\"encrypted\":\"eb5fcaddea649743e6354d8a3e07\",\"iv\":\"96192ba283631f9dd195d3b3\",\"authTag\":\"2f0c610eefac87de2182f630c54fee5f\"}','ilham-ii@example.com','O','$2b$10$poytYQdo9uRgAYBK7zpgte7xeKwNRcP5YqhRiPnHlJKzJRRiNriuW','2025-04-14 02:49:13','2025-04-14 02:49:13','01','11','{\"encrypted\":\"ddde07bd4cffba9c4ec4b110313bc38f7b765aadeaed406768e880da\",\"iv\":\"b39f9c27b02e453d84dc7c19\",\"authTag\":\"3f645cddcecd5bf1bda341bb18a0e743\"}'),
(2,'{\"encrypted\":\"7d112b841da2f728c9a02d03e6630567ae8bd8d7e0cb9d74\",\"iv\":\"43ae1d900cbccb0e9c37a7d5\",\"authTag\":\"8ee459afdb0b121f548f26e91152eefc\"}','{\"encrypted\":\"8535d614880abbe1bbe2dfb938330843\",\"iv\":\"d67930d3f4d19eff53b6793e\",\"authTag\":\"12d9ace23c2b3aab2bc8b1d468a68975\"}','P','garut','2001-01-01','{\"encrypted\":\"5b8e83b312\",\"iv\":\"18ecd8ab2aef32d53136e027\",\"authTag\":\"283b40569179b9a14a4bb8f3b1aba499\"}','02','1','44161','Pasirwangi','Pasirwangi','Kabupaten Garut','Jawa Barat','44161','Pasirwangi','Pasirwangi','Kabupaten Garut','Jawa Barat','{\"encrypted\":\"de1a398cc64299067932d915c9\",\"iv\":\"acbc86d51f3a67b6538d9de4\",\"authTag\":\"6da31281cc0711e0ab627446e3a92e49\"}','ilhamariforpin007tea@gmail.com','A','$2b$10$EcxvmUyzSTjcfGD14gsu6uaWweOi4FXc4.sjEOLMUEOlAN3cuLC2a','2025-04-14 06:46:02','2025-04-14 06:46:02','02','1','{\"encrypted\":\"4479135408\",\"iv\":\"de8a4425ae027c5f29a710ec\",\"authTag\":\"e18f70a71afdd3cc29198b30beee9e3a\"}'),
(3,'{\"encrypted\":\"42ca9f1089\",\"iv\":\"3d39952d1650da0ee7443afa\",\"authTag\":\"6f50750607be9990d5eb8926c89aca76\"}','{\"encrypted\":\"a080650279ebd38513764a001db5a0f4\",\"iv\":\"6a75c3cd1692fe5cca491ca7\",\"authTag\":\"c41bf23d10aafb415f6b80220bd58839\"}','P','garut','2001-02-20','{\"encrypted\":\"edc42f181c\",\"iv\":\"4a73830162520e09538cbcd6\",\"authTag\":\"b2919f83c70afab8b7ad17024812172b\"}','02','1','44161','Pasirwangi','Pasirwangi','Kabupaten Garut','Jawa Barat','44161','Pasirwangi','Pasirwangi','Kabupaten Garut','Jawa Barat','{\"encrypted\":\"0f8ba46b6211ed5c10731e7577\",\"iv\":\"f7f2ca72c0f6195d7bb967cc\",\"authTag\":\"18f6c0298c090bbcd2dfcbe7bf972e5c\"}','ilhamariforpin007@gmail.com','AB','$2b$10$f8KQJsHLsXbyjyTfwTRY9OZCaIuhcXL4u.l7waOVRQkFcRbHBq/lS','2025-04-14 06:48:40','2025-04-14 06:48:40','02','1','{\"encrypted\":\"ca0d688525\",\"iv\":\"1da866e60bc1c42e05130248\",\"authTag\":\"d4959c4bf65778b484e5fbca70b9b246\"}'),
(4,'{\"encrypted\":\"32cfd8a22b5ec5f5920de09cbe60a8\",\"iv\":\"3fa9a36cd9ebd0fc0f30f3ad\",\"authTag\":\"4c3646f37f7f73064bf265f22c669100\"}','{\"encrypted\":\"6d0bc0e0264ce1ec7983ce758b1a0e26\",\"iv\":\"99dd0842413916bec0c8da48\",\"authTag\":\"5f11348588b4afa108ad387ea89d4c5f\"}','P','garut','2001-02-03','{\"encrypted\":\"2e05f56ff2\",\"iv\":\"1ddc69443a8362ead6e3af5a\",\"authTag\":\"e065aaf272f47bfc1c0e92a5a5d12344\"}','02','1','44161','Pasirwangi','Pasirwangi','Kabupaten Garut','Jawa Barat','44161','Pasirwangi','Pasirwangi','Kabupaten Garut','Jawa Barat','{\"encrypted\":\"a260d4e70876958e85d5796929\",\"iv\":\"15f731edcd139dbc76517a2d\",\"authTag\":\"eaaa22d9ac29f9f217518ae29139c4b6\"}','ilhamariforpin@gmail.com','A','$2b$10$/4aBwVBAx/uZjOq5eftDg.0pbKKq4TUPOI3ChvkiOEENxk172YaVy','2025-04-14 06:57:38','2025-04-14 06:57:38','02','1','{\"encrypted\":\"127cb5410a\",\"iv\":\"8ab808779cab8aae3a94c75d\",\"authTag\":\"57c34648bd7acc7b26f7815594d9c03f\"}');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-04-21 10:14:34
