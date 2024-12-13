-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 28, 2024 at 08:07 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rase`
--

-- --------------------------------------------------------

--
-- Table structure for table `abstract_submission`
--

CREATE TABLE `abstract_submission` (
  `id` int(11) NOT NULL,
  `paper_title` varchar(255) NOT NULL,
  `corresponding_author_email` varchar(255) NOT NULL,
  `corresponding_author_name` varchar(255) NOT NULL,
  `coauthor_names` text DEFAULT NULL,
  `coauthor_email` varchar(255) DEFAULT NULL,
  `keywords` text NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `attachments_word` varchar(255) DEFAULT NULL,
  `attachments_pdf` varchar(255) DEFAULT NULL,
  `fee_receipt` varchar(255) DEFAULT NULL,
  `type` enum('Student','Research Scholars and Students','Delegates from Academics and R&D, Institutions','Delegates from Industry') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `accommodations`
--

CREATE TABLE `accommodations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `ContactNumber` varchar(20) NOT NULL,
  `Designation` varchar(255) NOT NULL,
  `Delegate` varchar(255) NOT NULL,
  `Delegatetype` varchar(100) NOT NULL,
  `event` varchar(255) NOT NULL,
  `accommodationtype` varchar(100) NOT NULL,
  `accommodationdate` date NOT NULL,
  `FeeReceipt` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `best_practices`
--

CREATE TABLE `best_practices` (
  `id` int(11) NOT NULL,
  `institutionName` varchar(255) NOT NULL,
  `aboutPractices` text NOT NULL,
  `keyPerson` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contactNumber` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `attachmentUrl` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conclave`
--

CREATE TABLE `conclave` (
  `id` int(11) NOT NULL,
  `typeofConclave` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `institutionName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contactNumber` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `views` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `delegate`
--

CREATE TABLE `delegate` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contactNumber` varchar(20) NOT NULL,
  `feeReceipt` varchar(255) DEFAULT NULL,
  `feeAmount` decimal(10,2) NOT NULL,
  `vb` text NOT NULL,
  `Websitelink` varchar(255) NOT NULL,
  `contribution` text NOT NULL,
  `accommodation` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `full_length_papers`
--

CREATE TABLE `full_length_papers` (
  `id` int(11) NOT NULL,
  `PaperTitle` varchar(255) NOT NULL,
  `CorrespondingAuthorEmail` varchar(255) NOT NULL,
  `CorrespondingAuthorName` varchar(255) NOT NULL,
  `CoauthorNames` text NOT NULL,
  `CoauthorEmail` text NOT NULL,
  `Keywords` text DEFAULT NULL,
  `ContactNumber` varchar(20) NOT NULL,
  `AttachmentsWord` varchar(255) DEFAULT NULL,
  `AttachmentsPdf` varchar(255) DEFAULT NULL,
  `AttachmentsPpt` varchar(255) DEFAULT NULL,
  `FeeReceipt` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hei_projects`
--

CREATE TABLE `hei_projects` (
  `id` int(11) NOT NULL,
  `projectName` varchar(255) NOT NULL,
  `projectDescription` text NOT NULL,
  `instituteName` varchar(255) NOT NULL,
  `instituteAddress` text NOT NULL,
  `teamSize` int(11) NOT NULL,
  `participants` text NOT NULL,
  `projectPptPath` varchar(255) NOT NULL,
  `projectVideoPath` varchar(255) NOT NULL,
  `feeUploadPath` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `institutions`
--

CREATE TABLE `institutions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contactNumber` varchar(20) NOT NULL,
  `website` varchar(255) NOT NULL,
  `cont` text NOT NULL,
  `feeAmount` decimal(10,2) NOT NULL,
  `feeReceipt` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ngos`
--

CREATE TABLE `ngos` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `registrationNo` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `contribution` text DEFAULT NULL,
  `accommodation` text DEFAULT NULL,
  `attachments` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organizers`
--

CREATE TABLE `organizers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `institution` varchar(255) NOT NULL,
  `duty` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `accommodation` text DEFAULT NULL,
  `stateCode` varchar(10) NOT NULL,
  `state` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `school_projects`
--

CREATE TABLE `school_projects` (
  `id` int(11) NOT NULL,
  `projectName` varchar(255) NOT NULL,
  `projectDescription` text NOT NULL,
  `schoolName` varchar(255) NOT NULL,
  `schoolAddress` text NOT NULL,
  `teamSize` int(11) NOT NULL,
  `participants` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`participants`)),
  `projectPpt` varchar(255) NOT NULL,
  `projectVideo` varchar(255) NOT NULL,
  `feeUpload` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `talents`
--

CREATE TABLE `talents` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `talentName` varchar(255) NOT NULL,
  `institutionName` varchar(255) NOT NULL,
  `talentType` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contactNumber` varchar(15) NOT NULL,
  `description` text DEFAULT NULL,
  `attachmentUrl` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `volunteers`
--

CREATE TABLE `volunteers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `Affiliation` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `PhoneNumber` varchar(20) NOT NULL,
  `Services` text NOT NULL,
  `accommodation` varchar(10) NOT NULL,
  `resumeUrl` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `abstract_submission`
--
ALTER TABLE `abstract_submission`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `accommodations`
--
ALTER TABLE `accommodations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `best_practices`
--
ALTER TABLE `best_practices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conclave`
--
ALTER TABLE `conclave`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `delegate`
--
ALTER TABLE `delegate`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `full_length_papers`
--
ALTER TABLE `full_length_papers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hei_projects`
--
ALTER TABLE `hei_projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `institutions`
--
ALTER TABLE `institutions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ngos`
--
ALTER TABLE `ngos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `organizers`
--
ALTER TABLE `organizers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `school_projects`
--
ALTER TABLE `school_projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `talents`
--
ALTER TABLE `talents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `volunteers`
--
ALTER TABLE `volunteers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `abstract_submission`
--
ALTER TABLE `abstract_submission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `accommodations`
--
ALTER TABLE `accommodations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `best_practices`
--
ALTER TABLE `best_practices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conclave`
--
ALTER TABLE `conclave`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `delegate`
--
ALTER TABLE `delegate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `full_length_papers`
--
ALTER TABLE `full_length_papers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hei_projects`
--
ALTER TABLE `hei_projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `institutions`
--
ALTER TABLE `institutions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ngos`
--
ALTER TABLE `ngos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `organizers`
--
ALTER TABLE `organizers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `school_projects`
--
ALTER TABLE `school_projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `talents`
--
ALTER TABLE `talents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `volunteers`
--
ALTER TABLE `volunteers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
