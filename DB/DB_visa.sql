-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 15, 2025 at 07:22 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12
CREATE DATABASE IF NOT EXISTS db_visa;
USE db_visa;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `DB_visa`
--

-- --------------------------------------------------------

--
-- Table structure for table `applicants`
--

CREATE TABLE `applicants` (
  `id` int(11) NOT NULL,
  `fina_ctm_key` varchar(60) DEFAULT NULL,
  `lbd_ctm_key` varchar(60) NOT NULL,
  `credit_rating` varchar(50) DEFAULT NULL,
  `name` varchar(25) NOT NULL,
  `surname` varchar(64) NOT NULL,
  `dob` date NOT NULL,
  `village` varchar(100) NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `district_id` int(11) NOT NULL,
  `relationship_status` varchar(50) NOT NULL,
  `doc_type` enum('id_card','passport','family_book','other') NOT NULL,
  `doc_number` varchar(50) NOT NULL,
  `issued_by` varchar(100) NOT NULL,
  `issued_date` date NOT NULL,
  `expiry_date` date NOT NULL,
  `province_id` int(11) DEFAULT NULL,
  `current_status` enum('in_progress','checked','rejected','issued','received') NOT NULL DEFAULT 'in_progress',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_rejected_feedback` text DEFAULT NULL,
  `is_corrected` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applicants`
--

INSERT INTO `applicants` (`id`, `fina_ctm_key`, `lbd_ctm_key`, `credit_rating`, `name`, `surname`, `dob`, `village`, `gender`, `district_id`, `relationship_status`, `doc_type`, `doc_number`, `issued_by`, `issued_date`, `expiry_date`, `province_id`, `current_status`, `created_at`, `updated_at`, `last_rejected_feedback`, `is_corrected`) VALUES
(543546506, 'F00133', 'LDB002', 'b', 'Bananab', 'ລາດຊະວົງ', '2025-07-06', 'ນາໄຊ', 'female', 12, 'married', 'passport', '324324', 'ໂທນີ້', '2025-06-17', '2025-08-26', 2, 'received', '2025-09-08 07:24:56', '2025-09-09 07:47:55', NULL, 0),
(543546507, 'F00133t', 'LDB00232', 'b', 'ecom', 'ລາດຊະວົງ', '2025-12-15', 'ນາໄຊ', 'female', 9, 'divorced', 'id_card', '505', 'ໂທນີ້', '2025-06-05', '2025-12-23', 1, 'received', '2025-09-08 07:26:10', '2025-09-09 07:47:55', NULL, 0),
(543546508, '896986l', 'LDB002445', 'b', 'ecom', 'ລາດຊະວົງ', '2025-07-08', 'ນາໄຊ', 'male', 9, 'married', 'id_card', '505', 'ໂທນີ້', '2025-11-11', '2025-08-06', 1, 'received', '2025-09-08 08:27:12', '2025-09-09 07:47:40', NULL, 0),
(543546509, 'yr56566565', 'LDB002234324324', 'b', 'Bananab', '453453rt', '2025-06-17', 'ນາໄຊ', 'female', 18, 'divorced', 'passport', '505', 'ໂທນີ້', '2025-06-12', '2025-11-18', 3, 'received', '2025-09-08 09:16:19', '2025-09-09 08:55:00', NULL, 0),
(543546510, 'tony', '32mr[32r', ';lmer;lmw', '23 l32', '23;lm;23r', '2018-09-24', ';wemf', 'male', 6, 'married', 'id_card', '21213', 'rpo', '2025-10-16', '2025-09-10', 1, 'received', '2025-09-09 15:08:50', '2025-09-09 16:36:23', 'ດີບໍ່ພໍ', 0),
(543546511, 'F00133432', 'LDB0024K', 'C', 'ນ້ອຍ', 'ນ້ອຍມີໄຊ', '2025-06-16', 'ນາໄຊ', 'male', 9, 'married', 'other', '505', 'ໂທນີ້', '2025-06-11', '2025-02-01', 1, 'rejected', '2025-09-10 01:42:38', '2025-09-10 02:25:41', 'ເອກະສານຜຶດເດີ້', 0),
(543546512, 'F00133323233KKK', 'LDB002LLL', 'b', 'Bananab', 'ລາດຊະວົງ', '2025-07-08', 'ນາtest', 'male', 5, 'married', 'id_card', '505', 'ໂທນີ້', '2025-05-06', '2025-09-24', 1, 'received', '2025-09-10 02:24:49', '2025-09-15 16:10:53', 'test reject\n', 0),
(543546513, 'F0013332', '-232ewrw', 'b', 'Bananab', 'ລາດຊະວົງ', '2025-05-28', 'ນາໄຊ', 'female', 7, 'single', 'id_card', '23334', 'ໂທນີ້', '2025-05-25', '2025-12-28', 1, 'rejected', '2025-09-12 03:40:25', '2025-09-15 17:13:40', '88hj', 0),
(543546514, 'F00133223', 'LDB002232', 'b', 'Bananab', 'ລາດຊະວົງ', '2025-08-06', 'ນາໄຊ', 'female', 52, 'married', 'id_card', '505', 'ໂທນີ້', '2025-07-09', '2026-02-19', 7, 'in_progress', '2025-09-12 07:29:05', '2025-09-12 07:29:05', NULL, 0),
(543546515, 'F001332234435', 'LDB002232123', 'b', 'Bananab', 'ລາດຊະວົງ', '2025-08-06', 'ນາໄຊ', 'female', 52, 'married', 'id_card', '505', 'ໂທນີ້', '2025-07-09', '2026-02-19', 7, 'in_progress', '2025-09-12 07:31:27', '2025-09-12 07:31:27', NULL, 0),
(543546516, 'F00133-/ภ', 'LDB002-//', 'b', 'Bananab', 'ລາດຊະວົງ', '2025-07-08', 'ນາໄຊ', 'male', 5, 'married', 'id_card', '505', '234234we', '2025-09-02', '2025-09-18', 1, 'checked', '2025-09-12 07:37:25', '2025-09-15 01:39:07', NULL, 0),
(543546517, 'F001333234', 'LDB00221313', 'b', 'Banana', 'ລາດຊະວົງ', '2025-06-11', 'ນາໄຊ', 'female', 12, 'married', 'id_card', '505', 'ໂທນີ້', '2025-06-12', '2025-10-01', 2, 'in_progress', '2025-09-12 07:57:22', '2025-09-12 07:57:22', NULL, 0),
(543546518, 'F001333432', 'LDB002234', 'b', 'Bananab', '453453rt', '2025-06-22', 'dfsf', 'male', 12, 'married', 'id_card', '505', 'ໂທນີ້', '2025-06-09', '2025-12-21', 2, 'in_progress', '2025-09-12 08:00:57', '2025-09-15 02:39:36', NULL, 0),
(543546519, 'F00133234', 'LDB00223423', 'b', 'j3n2j4', 'p32oj4p32o4j', '2025-05-28', 'ນາໄຊ', 'male', 5, 'married', 'family_book', '0009', 'ໂທນີ້', '2025-05-27', '2025-12-21', 1, 'received', '2025-09-15 16:09:45', '2025-09-15 16:10:53', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `applicant_documents`
--

CREATE TABLE `applicant_documents` (
  `id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `file_type` enum('customer_request_form','request_earmark_account','registration_form_credit_card','registration_form_gif_fina') DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applicant_documents`
--

INSERT INTO `applicant_documents` (`id`, `applicant_id`, `file_type`, `file_path`, `uploaded_at`) VALUES
(107, 543546506, 'customer_request_form', 'applicant_documents/customer_request_form/543546506_1757316296801.pdf', '2025-09-08 07:24:56'),
(108, 543546506, 'request_earmark_account', 'applicant_documents/request_earmark_account/543546506_1757316296803.pdf', '2025-09-08 07:24:56'),
(109, 543546506, 'registration_form_credit_card', 'applicant_documents/registration_form_credit_card/543546506_1757316296806.pdf', '2025-09-08 07:24:56'),
(110, 543546507, 'customer_request_form', 'applicant_documents/customer_request_form/543546507_1757316370536.pdf', '2025-09-08 07:26:10'),
(111, 543546507, 'registration_form_credit_card', 'applicant_documents/registration_form_credit_card/543546507_1757316370537.pdf', '2025-09-08 07:26:10'),
(112, 543546508, 'registration_form_credit_card', 'applicant_documents/registration_form_credit_card/543546508_1757320032315.pdf', '2025-09-08 08:27:12'),
(113, 543546509, 'request_earmark_account', 'applicant_documents/request_earmark_account/543546509_1757322979719.pdf', '2025-09-08 09:16:19'),
(114, 543546509, 'registration_form_credit_card', 'applicant_documents/registration_form_credit_card/543546509_1757322979719.pdf', '2025-09-08 09:16:19'),
(115, 543546510, 'customer_request_form', 'applicant_documents/customer_request_form/543546510_1757430530481.pdf', '2025-09-09 15:08:50'),
(116, 543546510, 'registration_form_credit_card', 'applicant_documents/registration_form_credit_card/543546510_1757430530483.pdf', '2025-09-09 15:08:50'),
(117, 543546510, 'request_earmark_account', 'applicant_documents/request_earmark_account/543546510_1757435054265.pdf', '2025-09-09 16:24:14'),
(118, 543546511, 'registration_form_credit_card', 'applicant_documents/registration_form_credit_card/543546511_1757468558077.pdf', '2025-09-10 01:42:38'),
(119, 543546512, 'customer_request_form', 'applicant_documents/customer_request_form/543546512_1757471089062.pdf', '2025-09-10 02:24:49'),
(120, 543546512, 'registration_form_credit_card', 'applicant_documents/registration_form_credit_card/543546512_1757471089062.pdf', '2025-09-10 02:24:49'),
(126, 543546513, 'registration_form_credit_card', 'applicant_documents/registration_form_credit_card/543546513_1757650837394.pdf', '2025-09-12 04:20:37'),
(131, 543546513, 'request_earmark_account', 'applicant_documents/request_earmark_account/543546513_1757661768295.pdf', '2025-09-12 07:22:48'),
(141, 543546517, 'customer_request_form', 'applicant_documents/customer_request_form/543546517_1757663842090.pdf', '2025-09-12 07:57:22'),
(142, 543546517, 'request_earmark_account', 'applicant_documents/request_earmark_account/543546517_1757663842095.pdf', '2025-09-12 07:57:22'),
(143, 543546517, 'registration_form_credit_card', 'applicant_documents/registration_form_credit_card/543546517_1757663842108.pdf', '2025-09-12 07:57:22'),
(144, 543546517, 'registration_form_gif_fina', 'applicant_documents/registration_form_gif_fina/543546517_1757663842105.pdf', '2025-09-12 07:57:22'),
(146, 543546518, 'registration_form_credit_card', 'applicant_documents/registration_form_credit_card/543546518_1757664057840.pdf', '2025-09-12 08:00:57'),
(149, 543546518, 'customer_request_form', 'applicant_documents/customer_request_form/543546518_1757664117799.pdf', '2025-09-12 08:01:57'),
(150, 543546518, 'request_earmark_account', 'applicant_documents/request_earmark_account/543546518_1757664117806.pdf', '2025-09-12 08:01:57'),
(151, 543546516, 'registration_form_credit_card', 'applicant_documents/registration_form_credit_card/543546516_1757664321455.pdf', '2025-09-12 08:05:21'),
(152, 543546516, 'registration_form_gif_fina', 'applicant_documents/registration_form_gif_fina/543546516_1757664321460.pdf', '2025-09-12 08:05:21'),
(153, 543546518, 'registration_form_gif_fina', 'applicant_documents/registration_form_gif_fina/543546518_1757900450528.pdf', '2025-09-15 01:40:50'),
(155, 543546513, 'registration_form_gif_fina', 'applicant_documents/registration_form_gif_fina/543546513_1757904654738.pdf', '2025-09-15 02:50:54'),
(156, 543546519, 'customer_request_form', 'applicant_documents/customer_request_form/543546519_1757952585088.pdf', '2025-09-15 16:09:45'),
(157, 543546519, 'request_earmark_account', 'applicant_documents/request_earmark_account/543546519_1757952585117.pdf', '2025-09-15 16:09:45'),
(158, 543546519, 'registration_form_credit_card', 'applicant_documents/registration_form_credit_card/543546519_1757952585122.pdf', '2025-09-15 16:09:45'),
(159, 543546519, 'registration_form_gif_fina', 'applicant_documents/registration_form_gif_fina/543546519_1757952585118.pdf', '2025-09-15 16:09:45');

--
-- Triggers `applicant_documents`
--
DELIMITER $$
CREATE TRIGGER `limit_applicant_documents` BEFORE INSERT ON `applicant_documents` FOR EACH ROW BEGIN
  DECLARE file_count INT;

  SELECT COUNT(*) INTO file_count 
  FROM applicant_documents 
  WHERE applicant_id = NEW.applicant_id;

  IF file_count >= 4 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Cannot upload more than 4 files per applicant';
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `data_entry_employee_id` varchar(50) DEFAULT NULL,
  `employee_id` varchar(50) DEFAULT NULL,
  `action` enum('check_document','issue_card','receive_card','upload_documents','edit_documents','rejected') NOT NULL,
  `status` enum('in_progress','checked','rejected','issued','received') NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `receiver_id` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `applicant_id`, `data_entry_employee_id`, `employee_id`, `action`, `status`, `timestamp`, `receiver_id`) VALUES
(155, 543546506, 'ldb7711', NULL, 'upload_documents', 'in_progress', '2025-09-08 07:24:56', NULL),
(156, 543546507, 'ldb0013', NULL, 'upload_documents', 'in_progress', '2025-09-08 07:26:10', NULL),
(157, 543546507, 'ldb0013', 'fina', 'check_document', 'checked', '2025-09-08 07:27:04', NULL),
(158, 543546506, 'ldb7711', 'fina', 'rejected', 'rejected', '2025-09-08 07:29:17', NULL),
(159, 543546506, 'ldb7711', 'fina', 'check_document', 'checked', '2025-09-08 07:29:56', NULL),
(160, 543546508, 'ldb0013', NULL, 'upload_documents', 'in_progress', '2025-09-08 08:27:12', NULL),
(162, 543546507, 'ldb0013', 'fina', 'check_document', 'checked', '2025-09-08 09:07:04', NULL),
(163, 543546509, 'ldb0013', NULL, 'upload_documents', 'in_progress', '2025-09-08 09:16:19', NULL),
(164, 543546508, 'ldb0013', 'fina', 'rejected', 'rejected', '2025-09-08 09:16:39', NULL),
(165, 543546507, 'ldb0013', 'fina', 'issue_card', 'issued', '2025-09-08 14:11:08', NULL),
(166, 543546509, 'ldb0013', 'fina', 'issue_card', 'issued', '2025-09-08 14:27:22', NULL),
(167, 543546509, 'ldb0013', 'fina', 'issue_card', 'issued', '2025-09-08 14:27:57', NULL),
(168, 543546506, 'ldb7711', 'fina', 'issue_card', 'issued', '2025-09-08 14:32:29', NULL),
(169, 543546509, 'ldb0013', 'fina', 'issue_card', 'issued', '2025-09-08 14:32:45', NULL),
(170, 543546508, 'ldb0013', 'fina', 'check_document', 'checked', '2025-09-09 01:56:09', NULL),
(171, 543546508, 'ldb0013', 'fina', 'issue_card', 'issued', '2025-09-09 02:15:44', NULL),
(172, 543546508, 'ldb0013', 'fina', 'check_document', 'checked', '2025-09-09 02:33:41', NULL),
(173, 543546508, 'ldb0013', 'fina', 'issue_card', 'issued', '2025-09-09 03:10:46', NULL),
(174, 543546508, NULL, 'fina', 'receive_card', 'received', '2025-09-09 07:47:40', 'ldb7711'),
(175, 543546509, NULL, 'fina', 'receive_card', 'received', '2025-09-09 07:47:55', 'ldb7711'),
(176, 543546506, NULL, 'fina', 'receive_card', 'received', '2025-09-09 07:47:55', 'ldb7711'),
(177, 543546507, NULL, 'fina', 'receive_card', 'received', '2025-09-09 07:47:55', 'ldb7711'),
(178, 543546509, 'ldb0013', 'fina', 'rejected', 'rejected', '2025-09-09 08:52:22', NULL),
(179, 543546509, 'ldb0013', 'fina', 'check_document', 'checked', '2025-09-09 08:52:52', NULL),
(180, 543546509, 'ldb0013', 'fina', 'issue_card', 'issued', '2025-09-09 08:53:01', NULL),
(181, 543546509, 'ldb0013', 'fina', 'receive_card', 'received', '2025-09-09 08:55:00', 'ldb7711'),
(182, 543546510, 'ldb0013', NULL, 'upload_documents', 'in_progress', '2025-09-09 15:08:50', NULL),
(183, 543546510, 'ldb0013', 'fina', 'rejected', 'rejected', '2025-09-09 15:25:35', NULL),
(184, 543546510, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-09 16:24:08', NULL),
(185, 543546510, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-09 16:24:14', NULL),
(186, 543546510, 'ldb0013', 'fina', 'check_document', 'checked', '2025-09-09 16:28:41', NULL),
(187, 543546510, 'ldb0013', 'fina', 'issue_card', 'issued', '2025-09-09 16:35:27', NULL),
(188, 543546510, 'ldb0013', 'fina', 'receive_card', 'received', '2025-09-09 16:36:23', 'ldb7711'),
(189, 543546511, 'ldb0013', NULL, 'upload_documents', 'in_progress', '2025-09-10 01:42:38', NULL),
(190, 543546511, 'ldb0013', 'fina', 'rejected', 'rejected', '2025-09-10 01:45:16', NULL),
(191, 543546512, 'ldb0013', NULL, 'upload_documents', 'in_progress', '2025-09-10 02:24:49', NULL),
(192, 543546512, 'ldb0013', 'fina', 'rejected', 'rejected', '2025-09-10 02:25:17', NULL),
(193, 543546511, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-10 02:25:41', NULL),
(194, 543546512, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-10 02:26:13', NULL),
(195, 543546512, 'ldb0013', 'fina', 'check_document', 'checked', '2025-09-10 04:18:29', NULL),
(196, 543546512, 'ldb0013', 'fina', 'issue_card', 'issued', '2025-09-10 07:47:08', NULL),
(197, 543546513, 'ldb0013', NULL, 'upload_documents', 'in_progress', '2025-09-12 03:40:25', NULL),
(198, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:11:35', NULL),
(199, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:13:41', NULL),
(200, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:14:00', NULL),
(201, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:14:17', NULL),
(202, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:16:52', NULL),
(203, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:18:04', NULL),
(204, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:20:20', NULL),
(205, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:20:23', NULL),
(206, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:20:37', NULL),
(207, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:20:51', NULL),
(208, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:21:16', NULL),
(209, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:21:36', NULL),
(210, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:21:41', NULL),
(211, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:21:58', NULL),
(212, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:22:07', NULL),
(213, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:22:14', NULL),
(214, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:22:30', NULL),
(215, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 04:22:38', NULL),
(216, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 06:43:37', NULL),
(217, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 06:48:13', NULL),
(218, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 07:05:13', NULL),
(219, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 07:15:37', NULL),
(220, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 07:22:36', NULL),
(221, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 07:22:40', NULL),
(222, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 07:22:48', NULL),
(223, 543546517, 'ldb0013', NULL, 'upload_documents', 'in_progress', '2025-09-12 07:57:22', NULL),
(224, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 07:57:50', NULL),
(225, 543546518, 'ldb0013', NULL, 'upload_documents', 'in_progress', '2025-09-12 08:00:57', NULL),
(226, 543546518, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 08:01:06', NULL),
(227, 543546518, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 08:01:46', NULL),
(228, 543546518, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 08:01:57', NULL),
(229, 543546516, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-12 08:05:21', NULL),
(230, 543546516, 'ldb0013', 'fina', 'check_document', 'checked', '2025-09-15 01:39:07', NULL),
(231, 543546518, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-15 01:40:32', NULL),
(232, 543546518, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-15 01:40:50', NULL),
(233, 543546518, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-15 02:39:36', NULL),
(234, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-15 02:40:30', NULL),
(235, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-15 02:40:40', NULL),
(236, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-15 02:41:07', NULL),
(237, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-15 02:42:41', NULL),
(238, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-15 02:50:42', NULL),
(239, 543546513, 'ldb0013', NULL, 'edit_documents', 'in_progress', '2025-09-15 02:50:54', NULL),
(240, 543546519, 'U01', NULL, 'upload_documents', 'in_progress', '2025-09-15 16:09:45', NULL),
(241, 543546519, 'U01', 'C01', 'check_document', 'checked', '2025-09-15 16:10:29', NULL),
(242, 543546519, 'U01', 'C01', 'issue_card', 'issued', '2025-09-15 16:10:35', NULL),
(243, 543546519, 'U01', 'C01', 'receive_card', 'received', '2025-09-15 16:10:53', 'R01'),
(244, 543546512, 'ldb0013', 'C01', 'receive_card', 'received', '2025-09-15 16:10:53', 'R01'),
(245, 543546513, 'ldb0013', 'C01', 'rejected', 'rejected', '2025-09-15 16:17:51', NULL),
(246, 543546513, 'U01', NULL, 'edit_documents', 'in_progress', '2025-09-15 16:18:29', NULL),
(247, 543546513, 'U01', NULL, 'edit_documents', 'in_progress', '2025-09-15 17:13:40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

CREATE TABLE `districts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `province_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`id`, `name`, `province_id`) VALUES
(1, 'ເມືອງຈັນທະບູລີ', 1),
(2, 'ເມືອງສີໂຄດຕະບອງ', 1),
(3, 'ເມືອງໄຊເສດຖາ', 1),
(4, 'ເມືອງສີສັດຕະນາກ', 1),
(5, 'ເມືອງນາຊາຍທອງ', 1),
(6, 'ເມືອງໄຊທານີ', 1),
(7, 'ເມືອງຫາດຊາຍຟອງ', 1),
(8, 'ເມືອງສັງທອງ', 1),
(9, 'ເມືອງປາກງື່ມ', 1),
(10, 'ເມືອງໄຊເຊດຖາ', 2),
(11, 'ເມືອງສາມັກຄີໄຊ', 2),
(12, 'ເມືອງສະໜາມໄຊ', 2),
(13, 'ເມືອງສານໄຊ', 2),
(14, 'ເມືອງພູວົງ', 2),
(15, 'ເມືອງຫ້ວຍຊາຍ', 3),
(16, 'ເມືອງຕົ້ນເຜິ້ງ', 3),
(17, 'ເມືອງເມິງ', 3),
(18, 'ເມືອງຜາອຸດົມ', 3),
(19, 'ເມືອງປາກທາ', 3),
(20, 'ເມືອງປາກຊັນ', 4),
(21, 'ເມືອງທ່າພະບາດ', 4),
(22, 'ເມືອງປາກກະດິງ', 4),
(23, 'ເມືອງບໍລິຄັນ', 4),
(24, 'ເມືອງຄຳເກີດ', 4),
(25, 'ເມືອງວຽງທອງ', 4),
(26, 'ເມືອງໄຊຈຳພອນ', 4),
(27, 'ເມືອງປາກເຊ', 5),
(28, 'ເມືອງຊະນະສົມບູນ', 5),
(29, 'ເມືອງບາຈຽງຈະເລີນສຸກ', 5),
(30, 'ເມືອງປາກຊ່ອງ', 5),
(31, 'ເມືອງປະທຸມພອນ', 5),
(32, 'ເມືອງໂພນທອງ', 5),
(33, 'ເມືອງຈຳປາສັກ', 5),
(34, 'ເມືອງສຸຂຸມາ', 5),
(35, 'ເມືອງມູນລະປະໂມກ', 5),
(36, 'ເມືອງໂຂງ', 5),
(37, 'ເມືອງຊຳເໜືອ', 6),
(38, 'ເມືອງຊຽງຄໍ', 6),
(39, 'ເມືອງຫົວເມືອງ', 6),
(40, 'ເມືອງຊ່ອນ', 6),
(41, 'ເມືອງສົບເບົາ', 6),
(42, 'ເມືອງຮຽມ', 6),
(43, 'ເມືອງວຽງທອງ', 6),
(44, 'ເມືອງແອດ', 6),
(45, 'ເມືອງທ່າແຂກ', 7),
(46, 'ເມືອງມະຫາໄຊ', 7),
(47, 'ເມືອງໜອງບົກ', 7),
(48, 'ເມືອງຫີນບູນ', 7),
(49, 'ເມືອງເຊບັ້ງໄຟ', 7),
(50, 'ເມືອງນາກາຍ', 7),
(51, 'ເມືອງບົວລະພາ', 7),
(52, 'ເມືອງຍົມມະລາດ', 7),
(53, 'ເມືອງຄູນຄຳ', 7),
(54, 'ເມືອງໄຊບົວທອງ', 7),
(55, 'ເມືອງຫຼວງນ້ຳທາ', 8),
(56, 'ເມືອງສິງ', 8),
(57, 'ເມືອງລອງ', 8),
(58, 'ເມືອງວຽງພູຄາ', 8),
(59, 'ເມືອງນາແລ', 8),
(60, 'ເມືອງຫຼວງພະບາງ', 9),
(61, 'ເມືອງຊຽງເງິນ', 9),
(62, 'ເມືອງນານ', 9),
(63, 'ເມືອງປາກອູ', 9),
(64, 'ເມືອງນ້ຳບາກ', 9),
(65, 'ເມືອງງອຍ', 9),
(66, 'ເມືອງປາກແຊງ', 9),
(67, 'ເມືອງໂພນໄຊ', 9),
(68, 'ເມືອງຈອມເພັດ', 9),
(69, 'ເມືອງວຽງຄຳ', 9),
(70, 'ເມືອງພູຄູນ', 9),
(71, 'ເມືອງໂພນທອງ', 9),
(72, 'ເມືອງໄຊ', 10),
(73, 'ເມືອງຫຼາ', 10),
(74, 'ເມືອງນາໝໍ້', 10),
(75, 'ເມືອງງາ', 10),
(76, 'ເມືອງແບ່ງ', 10),
(77, 'ເມືອງຮູນ', 10),
(78, 'ເມືອງປາກແບ່ງ', 10),
(79, 'ເມືອງຜົ້ງສາລີ', 11),
(80, 'ເມືອງໃໝ່', 11),
(81, 'ເມືອງຂວາ', 11),
(82, 'ເມືອງສຳພັນ', 11),
(83, 'ເມືອງບຸນໃຕ້', 11),
(84, 'ເມືອງຍອດອູ', 11),
(85, 'ເມືອງບຸນເໜືອ', 11),
(86, 'ເມືອງສາລະວັນ', 12),
(87, 'ເມືອງຕະໂອຍ', 12),
(88, 'ເມືອງຕຸ້ມລານ', 12),
(89, 'ເມືອງລະຄອນເພັງ', 12),
(90, 'ເມືອງວາປີ', 12),
(91, 'ເມືອງຄົງເຊໂດນ', 12),
(92, 'ເມືອງເລົ່າງາມ', 12),
(93, 'ເມືອງສະໝ້ວຍ', 12),
(94, 'ເມືອງສາລະວັນ', 12),
(95, 'ເມືອງຕະໂອຍ', 12),
(96, 'ເມືອງຕຸ້ມລານ', 12),
(97, 'ເມືອງລະຄອນເພັງ', 12),
(98, 'ເມືອງວາປີ', 12),
(99, 'ເມືອງຄົງເຊໂດນ', 12),
(100, 'ເມືອງເລົ່າງາມ', 12),
(101, 'ເມືອງສະໝ້ວຍ', 12),
(102, 'ເມືອງລະມາມ', 14),
(103, 'ເມືອງກະລືມ', 14),
(104, 'ເມືອງດາກຈຶງ', 14),
(105, 'ເມືອງທ່າແຕງ', 14),
(106, 'ເມືອງໂພນໂຮງ', 15),
(107, 'ເມືອງທຸລະຄົມ', 15),
(108, 'ເມືອງແກ້ວອຸດົມ', 15),
(109, 'ເມືອງກາສີ', 15),
(110, 'ເມືອງວັງວຽງ', 15),
(111, 'ເມືອງເຟືອງ', 15),
(112, 'ເມືອງຊະນະຄາມ', 15),
(113, 'ເມືອງແມດ', 15),
(114, 'ເມືອງຫີນເຫີບ', 15),
(115, 'ເມືອງວຽງຄຳ', 15),
(116, 'ເມືອງໄຊສະຖານ', 15),
(117, 'ເມືອງໝື່ນ', 15),
(118, 'ເມືອງໄຊຍະບູລີ', 16),
(119, 'ເມືອງຄອບ', 16),
(120, 'ເມືອງຫົງສາ', 16),
(121, 'ເມືອງເງິນ', 16),
(122, 'ເມືອງຊຽງຮ່ອນ', 16),
(123, 'ເມືອງບໍ່ແຕນ', 16),
(124, 'ເມືອງຫົງສາ', 16),
(125, 'ເມືອງແກ່ນທ້າວ', 16),
(126, 'ເມືອງປາກລາຍ', 16),
(127, 'ເມືອງພຽງ', 16),
(128, 'ເມືອງທົ່ງມີໄຊ', 16),
(129, 'ເມືອງອະນຸວົງ', 17),
(130, 'ເມືອງລ່ອງແຈ້ງ', 17),
(131, 'ເມືອງຮົ່ມ', 17),
(132, 'ເມືອງທ່າໂທມ', 17),
(133, 'ເມືອງລ້ອງຊານ', 17),
(134, 'ເມືອງແປກ', 18),
(135, 'ເມືອງຄຳ', 18),
(136, 'ເມືອງຄູນ', 18),
(137, 'ເມືອງໝອກໃໝ່', 18),
(138, 'ເມືອງໜອງແຮດ', 18),
(139, 'ເມືອງພູກູດ', 18),
(140, 'ເມືອງຜາໄຊ', 18);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(60) DEFAULT NULL,
  `role` enum('data_entry','verifier','receiver','admin') NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `last_name`, `email`, `role`, `password`) VALUES
('C01', 'jun', 'na', 'wdne', 'verifier', '$2b$10$.IxK0Okmqc20RdaCLN8uceQBcwfvmvsYZg7q06v5aarOY9ueBf76G'),
('fina', 'ແສງ', 'ສະຫວິນ', NULL, 'verifier', '$2b$10$3Nx5GqWBXalq1saW.l4QUevLMAbBuaUX9Jh5I8NztTa96cvr8TEJS'),
('ldb0013', 'Tony', 'Latsavong', NULL, 'data_entry', '$2b$10$hg5PkDG.UEDCURYmqFRQIu1T7PxtJFNpXRrfcjGY6aWgUYf.gR1ia'),
('ldb7711', 'noy', 'noynaja', NULL, 'receiver', '$2b$10$hg5PkDG.UEDCURYmqFRQIu1T7PxtJFNpXRrfcjGY6aWgUYf.gR1ia'),
('R01', 'hup', 'doc', 'poer4', 'receiver', '$2b$10$FhLRXPcGzXr29bV5ojMcpexEk4ltFHChesABrNTe4Pmk25gLZA1.q'),
('tony7711', 'yoy', 'sambay', NULL, 'admin', '$2b$10$hg5PkDG.UEDCURYmqFRQIu1T7PxtJFNpXRrfcjGY6aWgUYf.gR1ia'),
('U01', 'GUGU', 'nu', 'ofenwoif', 'data_entry', '$2b$10$fk//46dJTK1BgFK/gq8loeI90QT9EFejhTtxMQ.Apj7mrSBSVQsa.');

-- --------------------------------------------------------

--
-- Table structure for table `provinces`
--

CREATE TABLE `provinces` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provinces`
--

INSERT INTO `provinces` (`id`, `name`) VALUES
(1, 'ນະຄອນຫຼວງວຽງຈັນ'),
(2, 'ແຂວງອັດຕະປື'),
(3, 'ແຂວງບໍ່ແກ້ວ'),
(4, 'ແຂວງບໍລິຄຳໄຊ'),
(5, 'ແຂວງຈຳປາສັກ'),
(6, 'ແຂວງຫົວພັນ'),
(7, 'ແຂວງຄຳມ່ວນ'),
(8, 'ແຂວງຫຼວງນ້ຳທາ'),
(9, 'ແຂວງຫຼວງພະບາງ'),
(10, 'ແຂວງອຸດົມໄຊ'),
(11, 'ແຂວງຜົ້ງສາລີ'),
(12, 'ແຂວງສາລະວັນ'),
(13, 'ແຂວງສະຫວັນນະເຂດ'),
(14, 'ແຂວງເຊກອງ'),
(15, 'ແຂວງວຽງຈັນ'),
(16, 'ແຂວງໄຊຍະບູລີ'),
(17, 'ແຂວງໄຊສົມບູນ'),
(18, 'ແຂວງຊຽງຂວາງ');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applicants`
--
ALTER TABLE `applicants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lbd_ctm_key` (`lbd_ctm_key`),
  ADD UNIQUE KEY `fina_ctm_key` (`fina_ctm_key`),
  ADD KEY `fk_district_applicant` (`district_id`),
  ADD KEY `fk_applicants_province_id` (`province_id`);

--
-- Indexes for table `applicant_documents`
--
ALTER TABLE `applicant_documents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_file_type_per_applicant` (`applicant_id`,`file_type`),
  ADD KEY `idx_applicant_id` (`applicant_id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_applicant` (`applicant_id`),
  ADD KEY `fk_data_entry` (`data_entry_employee_id`),
  ADD KEY `fk_verifier` (`employee_id`),
  ADD KEY `fk_receiver` (`receiver_id`);

--
-- Indexes for table `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_province` (`province_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `provinces`
--
ALTER TABLE `provinces`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applicants`
--
ALTER TABLE `applicants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=543546520;

--
-- AUTO_INCREMENT for table `applicant_documents`
--
ALTER TABLE `applicant_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=248;

--
-- AUTO_INCREMENT for table `districts`
--
ALTER TABLE `districts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=143;

--
-- AUTO_INCREMENT for table `provinces`
--
ALTER TABLE `provinces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applicants`
--
ALTER TABLE `applicants`
  ADD CONSTRAINT `fk_applicants_province_id` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`id`),
  ADD CONSTRAINT `fk_district_applicant` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`);

--
-- Constraints for table `applicant_documents`
--
ALTER TABLE `applicant_documents`
  ADD CONSTRAINT `applicant_documents_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `fk_applicant` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`id`),
  ADD CONSTRAINT `fk_data_entry` FOREIGN KEY (`data_entry_employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `fk_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `fk_verifier` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `districts`
--
ALTER TABLE `districts`
  ADD CONSTRAINT `fk_province` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
