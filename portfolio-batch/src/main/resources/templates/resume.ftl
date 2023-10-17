<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8"/>
    <title>Resume</title>
    <style>
        <#include "resume.css">
    </style>
</head>

<body>
<div class="container">
    <div class="person outter-ctn">
        <h1 class="title">${resume.person.name}</h1>
        <div class="inner-ctn">
            <div class="separator"></div>
            <div class="image">
            </div>
            <div class="vertical-separator"></div>
            <div class="title-description">
                <h2>${resume.person.title} - ${resume.person.experience}</h2>
                <span>${resume.person.description}</span>
            </div>
        </div>
    </div>
    <br/>
    <div class="contact-skill">
        <div class="contact outter-ctn">
            <h1 class="title">CONTACT</h1>
            <div class="inner-ctn">
                <div class="contact-info-ctn">
                    <div class="contact-info-number">

                        <h2>Numéro de téléphone</h2>
                        <p>${resume.person.phone} </p>
                    </div>
                    <div class="contact-info-address">

                        <h2>Addresse</h2>
                        <p style="text-align: center">${resume.person.address.street} 59120 ${resume.person.address.city}, ${resume.person.address.country}</p>
                    </div>
                    <div class="contact-info-email">

                        <h2>Email</h2>
                        <p>${resume.person.email}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="vertical-separator"></div>
        <div class="skill outter-ctn">
            <h1 class="title">Domaines de compétences :</h1>
            <div class="inner-ctn">
                <ul class="skill-list">
                    <#list resume.skills as skill>
                        <#if skill.value?matches("(https?://)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)")>
                            <li><span><b>${skill.type} : </b><a href="${skill.value}" target="_blank">${skill.value}</a></span></li>
                        <#else>
                            <li><span><b>${skill.type} : </b>${skill.value}</span></li>
                        </#if>
                    </#list>
                </ul>
            </div>
        </div>
    </div>
    <br/>
    <div class="experience-education-miscellaneous">
        <div class="education-miscellaneous">
            <div class="education outter-ctn">
                <h1 class="title">Education</h1>
                <div class="inner-ctn">
                    <ul class="education-list">
                        <#list resume.education.degrees as degree>
                            <h2>${degree.institution}</h2>
                            <li>
                                <span>${degree.duration} : </span>
                                <span>${degree.program}</span>
                            </li>
                            <br/>
                        </#list>
                    </ul>
                </div>
            </div>

            <div class="miscellaneous outter-ctn">
                <h1 class="title">Miscellaneous</h1>
                <div class="inner-ctn">
                    <h2>Veille technologique:</h2>
                    <p>${resume.miscellaneous.item}</p>
                </div>
            </div>
        </div>
        <div class="vertical-separator"></div>
        <div class="experience outter-ctn">
            <h1 class="title">Expérience Professionnelle :</h1>
            <div class="inner-ctn">
                <ul class="experience-list">
                    <#list resume.experience.jobs as job>
                        <br/>
                        <h2>${job.duration}: ${job.position}, ${job.company}: </h2>
                        <#if job.descriptionList?? && (job.descriptionList?size > 0) >
                            <#list job.descriptionList as descriptionItem>
                                <li>
                                    <span>${descriptionItem}</span><br/>
                                </li>
                            </#list>
                        <#else>
                            <li>
                                <span>${job.description}</span><br/>
                            </li>
                        </#if>
                    </#list>
                </ul>
            </div>
        </div>
    </div>


</div>
</body>

</html>