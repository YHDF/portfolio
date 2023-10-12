package fr.yha.portfoliobatch.generateresume.helpers.converter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class ImagePathConverter {

    private static final Logger LOGGER = LoggerFactory.getLogger(ImagePathConverter.class);

    public static List<File> getAllImageFiles(String directoryPath) {
        // Get URL to resource
        URL resource = ImagePathConverter.class.getClassLoader().getResource(directoryPath);
        if (resource == null) {
            LOGGER.error("No such resource: {}", directoryPath);
            throw new IllegalArgumentException("No such resource: " + directoryPath);
        }

        // Convert URL to File
        File directory = new File(resource.getFile());

        if (!directory.isDirectory()) {
            LOGGER.error("The provided path is not a directory: {}", directoryPath);
            throw new IllegalArgumentException("The provided path is not a directory: " + directoryPath);
        }

        // Filter out all files that are images (by file extension)
        File[] files = directory.listFiles((dir, name) -> name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg"));

        // Convert File array to List<File>
        List<File> imageFiles = new ArrayList<>();
        if (files != null) {
            for (File file : files) {
                if (file.isFile()) {
                    imageFiles.add(file);
                }
            }
            LOGGER.info("Found {} image files in directory: {}", imageFiles.size(), directoryPath);
        } else {
            LOGGER.warn("No image files found in directory: {}", directoryPath);
        }

        return imageFiles;
    }

    public static String convertRelativePathsToAbsolute(String cssContent, List<File> imageFiles) {
        String updatedCssContent = cssContent;

        for (File imageFile : imageFiles) {
            String fileName = imageFile.getName();
            String absolutePath = "file:///" + imageFile.getAbsolutePath();
            // Replace the relative path with absolute path
            updatedCssContent = updatedCssContent.replace("../assets/" + fileName, absolutePath);
        }

        LOGGER.info("Converted relative paths to absolute in CSS content.");

        return updatedCssContent;
    }
}
