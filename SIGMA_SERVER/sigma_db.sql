-- --------------------------------------------------------
-- Хост:                         127.0.0.1
-- Версия сервера:               11.0.2-MariaDB - mariadb.org binary distribution
-- Операционная система:         Win64
-- HeidiSQL Версия:              12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Дамп структуры базы данных sigma
CREATE DATABASE IF NOT EXISTS `sigma` /*!40100 DEFAULT CHARACTER SET utf32 COLLATE utf32_general_ci */;
USE `sigma`;

-- Дамп структуры для таблица sigma.test
CREATE TABLE IF NOT EXISTS `test` (
  `id` int(11) DEFAULT NULL,
  `name` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_general_ci;

-- Дамп данных таблицы sigma.test: ~0 rows (приблизительно)
DELETE FROM `test`;
INSERT INTO `test` (`id`, `name`) VALUES
	(1, 'Тест успешен');

-- Дамп структуры для таблица sigma.tuser
CREATE TABLE IF NOT EXISTS `tuser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(250) DEFAULT NULL,
  `email` varchar(250) DEFAULT NULL,
  `bitdelete` bit(1) DEFAULT NULL,
  `password` varchar(250) DEFAULT NULL,
  `fio` varchar(250) DEFAULT NULL,
  `organization` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf32 COLLATE=utf32_general_ci;

-- Дамп данных таблицы sigma.tuser: ~18 rows (приблизительно)
DELETE FROM `tuser`;
INSERT INTO `tuser` (`id`, `login`, `email`, `bitdelete`, `password`, `fio`, `organization`) VALUES
	(1, 'Администратор', 'test@test.com', b'0', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', NULL, NULL),
	(2, 'Администратор1', 'klipach@mail.ru', b'0', '874b1b0131082189a7663cbad486dd26e37caa690f3834822f50c2c323b53b0b', NULL, NULL),
	(3, 'login', 'email', b'0', 'PASSWORD', 'fio', 'organization'),
	(4, 'G1', 'G1', b'0', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'G1', '1'),
	(5, 'd1', '111', b'0', 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae', 'd1', '12'),
	(6, 'qw1', '1111', b'0', 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae', '111', '1'),
	(7, 'ss1', 'ss1', b'0', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'ss1', '1'),
	(8, 'q1', 'qq', b'0', 'a95bc16631ae2b6fadb455ee018da0adc2703e56d89e3eed074ce56d2f7b1b6a', 'q1', '1'),
	(9, 'S', 'ss', b'0', 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae', 'S', 'S'),
	(10, 'QWQ', 'QWQW', b'0', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Q', 'Q'),
	(11, 'QWQ', 'QWQW', b'0', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Q', 'Q'),
	(12, 'QWQ', 'QWQW', b'0', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Q', 'Q'),
	(13, 'werty', 'werty', b'0', '7728b304403b6481a036623e7cedd8f73532328e0296acd8e9c6accd0816b345', 'werty', 'werty'),
	(14, 'fff', 'fff', b'0', 'f284bdc3c1c9e24a494e285cb387c69510f28de51c15bb93179d9c7f28705398', 'fff', 'fff'),
	(15, 'ddd', 'ddd', b'0', '730f75dafd73e047b86acb2dbd74e75dcb93272fa084a9082848f2341aa1abb6', 'dd', 'dd'),
	(16, '16', '16', b'0', 'bb668ca95563216088b98a62557fa1e26802563f3919ac78ae30533bb9ed422c', '16', '16'),
	(17, '171', '171', b'0', '284de502c9847342318c17d474733ef468fbdbe252cddf6e4b4be0676706d9d0', '171', '171'),
	(18, 'Тест', 'klipach@mail1.ru', b'0', 'e34f6dec12c4f4599eba078f31ae8139420d21b1bd2d7ced7d22b09c2074fb48', 'Тест', 'Тест');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
